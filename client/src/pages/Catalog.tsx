import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useState, useMemo } from "react";
import { BookOpen, Search, Plus, X } from "lucide-react";
import { toast } from "sonner";

export default function Catalog() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [selectedAuthor, setSelectedAuthor] = useState<number | undefined>();
  const [selectedPublisher, setSelectedPublisher] = useState<number | undefined>();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    authorId: "",
    publisherId: "",
    categoryId: "",
    price: "",
    stock: "",
    isbn: "",
    coverImageUrl: "",
    publishedYear: "",
  });
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");

  const { data: categories } = trpc.categories.list.useQuery();
  const { data: authors } = trpc.authors.list.useQuery();
  const { data: publishers } = trpc.publishers.list.useQuery();
  const { refetch: refetchBooks } = trpc.books.search.useQuery(
    {
      query: searchQuery || "a",
      categoryId: selectedCategory,
      authorId: selectedAuthor,
      publisherId: selectedPublisher,
      limit: 24,
    },
    { enabled: true }
  );
  const createBookMutation = trpc.books.create.useMutation();
  const uploadCoverMutation = trpc.books.uploadCover.useMutation();

  const { data: books, isLoading } = trpc.books.search.useQuery(
    {
      query: searchQuery || "a",
      categoryId: selectedCategory,
      authorId: selectedAuthor,
      publisherId: selectedPublisher,
      limit: 24,
    },
    { enabled: true }
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitBook = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.authorId ||
      !formData.publisherId ||
      !formData.categoryId ||
      !formData.price
    ) {
      toast.error("Silakan isi semua field yang diperlukan");
      return;
    }

    setIsSubmitting(true);
    try {
      let coverImageUrl = formData.coverImageUrl;

      if (coverImageFile) {
        const reader = new FileReader();
        const uploadPromise = new Promise<string>((resolve, reject) => {
          reader.onload = async (event) => {
            try {
              const base64 = (event.target?.result as string).split(",")[1];
              const uploadResult = await uploadCoverMutation.mutateAsync({
                fileName: coverImageFile.name,
                fileData: base64,
                mimeType: coverImageFile.type,
              });
              resolve(uploadResult.url);
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(coverImageFile);
        });
        coverImageUrl = await uploadPromise;
      }

      await createBookMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        authorId: parseInt(formData.authorId),
        publisherId: parseInt(formData.publisherId),
        categoryId: parseInt(formData.categoryId),
        price: formData.price,
        stock: parseInt(formData.stock) || 0,
        isbn: formData.isbn,
        coverImageUrl: coverImageUrl,
        publishedYear: formData.publishedYear
          ? parseInt(formData.publishedYear)
          : undefined,
      });

      toast.success("Buku berhasil ditambahkan!");
      setFormData({
        title: "",
        description: "",
        authorId: "",
        publisherId: "",
        categoryId: "",
        price: "",
        stock: "",
        isbn: "",
        coverImageUrl: "",
        publishedYear: "",
      });
      setCoverImageFile(null);
      setCoverPreview("");
      setShowAddForm(false);
      refetchBooks();
    } catch (error) {
      toast.error("Gagal menambahkan buku. Silakan coba lagi.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      authorId: "",
      publisherId: "",
      categoryId: "",
      price: "",
      stock: "",
      isbn: "",
      coverImageUrl: "",
      publishedYear: "",
    });
    setCoverImageFile(null);
    setCoverPreview("");
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border py-12 md:py-16">
        <div className="container flex items-center justify-between">
          <div>
            <h1 className="text-heading mb-4">Katalog Buku</h1>
            <p className="text-body text-muted-foreground">
              Jelajahi ribuan buku dari berbagai kategori dan penulis
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-accent text-accent-foreground hover:bg-accent/90 flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Tambah Buku
          </Button>
        </div>
      </section>

      {/* Add Book Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-heading">Tambah Buku Baru</h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-muted/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitBook} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Judul Buku *
                </label>
                <Input
                  type="text"
                  name="title"
                  placeholder="Masukkan judul buku"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Penulis *
                  </label>
                  <select
                    name="authorId"
                    value={formData.authorId}
                    onChange={handleInputChange}
                    className="w-full border border-border px-3 py-2 rounded text-sm"
                    required
                  >
                    <option value="">Pilih Penulis</option>
                    {authors?.map((author) => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Penerbit *
                  </label>
                  <select
                    name="publisherId"
                    value={formData.publisherId}
                    onChange={handleInputChange}
                    className="w-full border border-border px-3 py-2 rounded text-sm"
                    required
                  >
                    <option value="">Pilih Penerbit</option>
                    {publishers?.map((pub) => (
                      <option key={pub.id} value={pub.id}>
                        {pub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Kategori *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full border border-border px-3 py-2 rounded text-sm"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  placeholder="Masukkan deskripsi buku"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border border-border px-3 py-2 rounded text-sm resize-none h-24"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Harga (Rp) *
                  </label>
                  <Input
                    type="number"
                    name="price"
                    placeholder="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stok
                  </label>
                  <Input
                    type="number"
                    name="stock"
                    placeholder="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    ISBN
                  </label>
                  <Input
                    type="text"
                    name="isbn"
                    placeholder="978-3-16-148410-0"
                    value={formData.isbn}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tahun Terbit
                  </label>
                  <Input
                    type="number"
                    name="publishedYear"
                    placeholder="2024"
                    value={formData.publishedYear}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload Gambar Cover (Pilihan 1)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="w-full border border-border px-3 py-2 rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Atau Gunakan URL Gambar (Pilihan 2)
                </label>
                <Input
                  type="url"
                  name="coverImageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={formData.coverImageUrl}
                  onChange={handleInputChange}
                />
              </div>

              {(coverPreview || formData.coverImageUrl) && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Preview Gambar
                  </label>
                  <img
                    src={coverPreview || formData.coverImageUrl}
                    alt="Preview"
                    className="w-32 h-48 object-cover border border-border rounded"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Buku"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                >
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="container py-8 md:py-12">
        {showAddForm && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
            Form tambah buku terbuka di atas halaman
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <div>
              <h3 className="font-semibold mb-4">Cari Buku</h3>
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Judul atau penulis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Category Filter */}
            {categories && categories.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">Kategori</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(undefined)}
                    className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      !selectedCategory
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    Semua Kategori
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        selectedCategory === cat.id
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Author Filter */}
            {authors && authors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">Penulis</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedAuthor(undefined)}
                    className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      !selectedAuthor
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    Semua Penulis
                  </button>
                  {authors.map((author) => (
                    <button
                      key={author.id}
                      onClick={() => setSelectedAuthor(author.id)}
                      className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        selectedAuthor === author.id
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      {author.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Publisher Filter */}
            {publishers && publishers.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">Penerbit</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedPublisher(undefined)}
                    className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      !selectedPublisher
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    Semua Penerbit
                  </button>
                  {publishers.map((pub) => (
                    <button
                      key={pub.id}
                      onClick={() => setSelectedPublisher(pub.id)}
                      className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        selectedPublisher === pub.id
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      {pub.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clear Filters */}
            {(selectedCategory || selectedAuthor || selectedPublisher) && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedCategory(undefined);
                  setSelectedAuthor(undefined);
                  setSelectedPublisher(undefined);
                }}
              >
                Hapus Filter
              </Button>
            )}

            {/* Add Book Button (Mobile) */}
            <Button
              onClick={() => setShowAddForm(true)}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 lg:hidden flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tambah Buku
            </Button>
          </div>

          {/* Books Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-book bg-muted mb-4"></div>
                    <div className="h-4 bg-muted mb-2"></div>
                    <div className="h-4 bg-muted w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : books && books.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {books.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => navigate(`/book/${book.id}`)}
                    className="group text-left"
                  >
                    <div className="aspect-book bg-muted border border-border mb-4 flex items-center justify-center overflow-hidden hover:border-accent transition-colors">
                      {book.coverImageUrl ? (
                        <img
                          src={book.coverImageUrl}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <BookOpen className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>
                    <h4 className="font-semibold text-sm line-clamp-2 mb-2">
                      {book.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {book.authorId}
                    </p>
                    <p className="font-semibold text-sm">
                      Rp {parseInt(book.price).toLocaleString("id-ID")}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Tidak ada buku yang ditemukan
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
