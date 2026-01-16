import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { BookOpen, ShoppingCart, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function BookDetail() {
  const [, navigate] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const bookId = parseInt(window.location.pathname.split("/").pop() || "0");
  const [quantity, setQuantity] = useState(1);

  const { data: book, isLoading } = trpc.books.getById.useQuery(
    { id: bookId },
    { enabled: bookId > 0 }
  );

  const { data: author } = trpc.authors.getById.useQuery(
    { id: book?.authorId || 0 },
    { enabled: !!book?.authorId }
  );

  const { data: publisher } = trpc.publishers.getById.useQuery(
    { id: book?.publisherId || 0 },
    { enabled: !!book?.publisherId }
  );

  const { data: category } = trpc.categories.getById.useQuery(
    { id: book?.categoryId || 0 },
    { enabled: !!book?.categoryId }
  );

  const handleAddToCart = () => {
    if (!book) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === book.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: book.id,
        title: book.title,
        price: book.price,
        coverImageUrl: book.coverImageUrl,
        quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success(`${book.title} ditambahkan ke keranjang`);
    setTimeout(() => navigate("/cart"), 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-32 bg-muted"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="aspect-book bg-muted"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted w-3/4"></div>
                <div className="h-4 bg-muted w-1/2"></div>
                <div className="h-4 bg-muted w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-heading mb-2">Buku Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-6">
            Maaf, buku yang Anda cari tidak tersedia
          </p>
          <Button onClick={() => navigate("/catalog")}>
            Kembali ke Katalog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 md:py-12">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate("/catalog")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Katalog
        </button>

        {/* Book Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Image */}
          <div className="aspect-book bg-muted border border-border flex items-center justify-center overflow-hidden">
            {book.coverImageUrl ? (
              <img
                src={book.coverImageUrl}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <BookOpen className="w-24 h-24 text-muted-foreground" />
            )}
          </div>

          {/* Details */}
          <div className="space-y-8">
            {/* Title & Price */}
            <div className="space-y-4">
              <h1 className="text-heading">{book.title}</h1>
              <div className="flex items-baseline gap-4">
                <p className="text-4xl font-bold text-accent">
                  Rp {parseFloat(book.price.toString()).toLocaleString("id-ID")}
                </p>
                {book.stock > 0 ? (
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded">
                    Tersedia ({book.stock} stok)
                  </span>
                ) : (
                  <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded">
                    Habis
                  </span>
                )}
              </div>
            </div>

            {/* Book Info */}
            <div className="border-t border-b border-border py-6 space-y-4">
              {author && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Penulis</p>
                  <p className="font-medium">{author.name}</p>
                </div>
              )}
              {publisher && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Penerbit</p>
                  <p className="font-medium">{publisher.name}</p>
                </div>
              )}
              {category && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Kategori</p>
                  <p className="font-medium">{category.name}</p>
                </div>
              )}
              {book.isbn && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">ISBN</p>
                  <p className="font-medium">{book.isbn}</p>
                </div>
              )}
              {book.pages && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Halaman</p>
                  <p className="font-medium">{book.pages}</p>
                </div>
              )}
              {book.publishedYear && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Tahun Terbit
                  </p>
                  <p className="font-medium">{book.publishedYear}</p>
                </div>
              )}
            </div>

            {/* Description */}
            {book.description && (
              <div>
                <h3 className="font-semibold mb-3">Deskripsi</h3>
                <p className="text-body text-muted-foreground leading-relaxed">
                  {book.description}
                </p>
              </div>
            )}

            {/* Add to Cart */}
            {book.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-muted/50 transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-16 text-center border-l border-r border-border py-2 outline-none"
                      min="1"
                      max={book.stock}
                    />
                    <button
                      onClick={() =>
                        setQuantity(Math.min(book.stock, quantity + 1))
                      }
                      className="px-4 py-2 hover:bg-muted/50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Max: {book.stock}
                  </span>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 flex items-center justify-center gap-2"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Tambah ke Keranjang
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
