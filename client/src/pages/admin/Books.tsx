import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus, Edit2, Trash2, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function AdminBooks() {
  const [, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: books, refetch } = trpc.books.list.useQuery({ limit: 50 });
  const { data: authors } = trpc.authors.list.useQuery();
  const { data: publishers } = trpc.publishers.list.useQuery();
  const { data: categories } = trpc.categories.list.useQuery();

  const createMutation = trpc.books.create.useMutation();
  const updateMutation = trpc.books.update.useMutation();
  const deleteMutation = trpc.books.delete.useMutation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    authorId: "",
    publisherId: "",
    categoryId: "",
    price: "",
    stock: "",
    isbn: "",
    pages: "",
    publishedYear: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.authorId || !formData.publisherId || !formData.categoryId || !formData.price) {
      toast.error("Silakan isi semua field yang diperlukan");
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          title: formData.title,
          description: formData.description,
          authorId: parseInt(formData.authorId),
          publisherId: parseInt(formData.publisherId),
          categoryId: parseInt(formData.categoryId),
          price: formData.price,
          stock: parseInt(formData.stock) || 0,
          isbn: formData.isbn,
          pages: formData.pages ? parseInt(formData.pages) : undefined,
          publishedYear: formData.publishedYear ? parseInt(formData.publishedYear) : undefined,
        });
        toast.success("Buku berhasil diperbarui");
        setEditingId(null);
      } else {
        await createMutation.mutateAsync({
          title: formData.title,
          description: formData.description,
          authorId: parseInt(formData.authorId),
          publisherId: parseInt(formData.publisherId),
          categoryId: parseInt(formData.categoryId),
          price: formData.price,
          stock: parseInt(formData.stock) || 0,
          isbn: formData.isbn,
          pages: formData.pages ? parseInt(formData.pages) : undefined,
          publishedYear: formData.publishedYear ? parseInt(formData.publishedYear) : undefined,
        });
        toast.success("Buku berhasil ditambahkan");
      }

      setFormData({
        title: "",
        description: "",
        authorId: "",
        publisherId: "",
        categoryId: "",
        price: "",
        stock: "",
        isbn: "",
        pages: "",
        publishedYear: "",
      });
      setShowForm(false);
      refetch();
    } catch (error) {
      toast.error("Gagal menyimpan buku");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Buku berhasil dihapus");
        refetch();
      } catch (error) {
        toast.error("Gagal menghapus buku");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin")}
              className="p-2 hover:bg-muted/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-heading">Manajemen Buku</h1>
          </div>
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                title: "",
                description: "",
                authorId: "",
                publisherId: "",
                categoryId: "",
                price: "",
                stock: "",
                isbn: "",
                pages: "",
                publishedYear: "",
              });
            }}
            className="bg-accent text-accent-foreground hover:bg-accent/90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Buku
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="border border-border p-6 mb-8">
            <h3 className="font-semibold text-lg mb-4">
              {editingId ? "Edit Buku" : "Tambah Buku Baru"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="title"
                  placeholder="Judul Buku *"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                <select
                  name="authorId"
                  value={formData.authorId}
                  onChange={handleInputChange}
                  className="border border-border px-3 py-2 rounded text-sm"
                  required
                >
                  <option value="">Pilih Penulis *</option>
                  {authors?.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
                <select
                  name="publisherId"
                  value={formData.publisherId}
                  onChange={handleInputChange}
                  className="border border-border px-3 py-2 rounded text-sm"
                  required
                >
                  <option value="">Pilih Penerbit *</option>
                  {publishers?.map((pub) => (
                    <option key={pub.id} value={pub.id}>
                      {pub.name}
                    </option>
                  ))}
                </select>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="border border-border px-3 py-2 rounded text-sm"
                  required
                >
                  <option value="">Pilih Kategori *</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  name="price"
                  placeholder="Harga (Rp) *"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="number"
                  name="stock"
                  placeholder="Stok"
                  value={formData.stock}
                  onChange={handleInputChange}
                />
                <Input
                  type="text"
                  name="isbn"
                  placeholder="ISBN"
                  value={formData.isbn}
                  onChange={handleInputChange}
                />
                <Input
                  type="number"
                  name="pages"
                  placeholder="Jumlah Halaman"
                  value={formData.pages}
                  onChange={handleInputChange}
                />
                <Input
                  type="number"
                  name="publishedYear"
                  placeholder="Tahun Terbit"
                  value={formData.publishedYear}
                  onChange={handleInputChange}
                />
              </div>
              <textarea
                name="description"
                placeholder="Deskripsi"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border border-border px-3 py-2 rounded text-sm resize-none h-24"
              />
              <div className="flex gap-3">
                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {editingId ? "Update" : "Tambah"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  Batal
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Books List */}
        <div className="space-y-3">
          {books && books.length > 0 ? (
            books.map((book) => (
              <div
                key={book.id}
                className="border border-border p-4 flex items-center justify-between hover:border-accent transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold">{book.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Rp {parseFloat(book.price.toString()).toLocaleString("id-ID")} • Stok: {book.stock}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(book.id);
                      setFormData({
                        title: book.title,
                        description: book.description || "",
                        authorId: book.authorId.toString(),
                        publisherId: book.publisherId.toString(),
                        categoryId: book.categoryId.toString(),
                        price: book.price.toString(),
                        stock: book.stock.toString(),
                        isbn: book.isbn || "",
                        pages: book.pages?.toString() || "",
                        publishedYear: book.publishedYear?.toString() || "",
                      });
                      setShowForm(true);
                    }}
                    className="p-2 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Belum ada buku</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
