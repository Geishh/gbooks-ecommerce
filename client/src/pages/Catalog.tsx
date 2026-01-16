import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useState, useMemo } from "react";
import { BookOpen, Search } from "lucide-react";

export default function Catalog() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [selectedAuthor, setSelectedAuthor] = useState<number | undefined>();
  const [selectedPublisher, setSelectedPublisher] = useState<number | undefined>();

  const { data: categories } = trpc.categories.list.useQuery();
  const { data: authors } = trpc.authors.list.useQuery();
  const { data: publishers } = trpc.publishers.list.useQuery();

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border py-12 md:py-16">
        <div className="container">
          <h1 className="text-heading mb-4">Katalog Buku</h1>
          <p className="text-body text-muted-foreground">
            Jelajahi ribuan buku dari berbagai kategori dan penulis
          </p>
        </div>
      </section>

      <div className="container py-8 md:py-12">
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
                <div className="space-y-2 max-h-64 overflow-y-auto">
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
                <div className="space-y-2 max-h-64 overflow-y-auto">
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
                    <p className="text-xs text-muted-foreground mb-3">
                      {book.stock > 0 ? "Tersedia" : "Habis"}
                    </p>
                    <p className="text-accent font-bold">
                      Rp {parseFloat(book.price.toString()).toLocaleString("id-ID")}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
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
