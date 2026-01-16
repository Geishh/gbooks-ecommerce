import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { BookOpen, Truck, Award, Clock } from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: featuredBooks } = trpc.books.featured.useQuery({ limit: 6 });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-background border-b border-border">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center py-20 md:py-32">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 bg-accent"></div>
                <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Selamat Datang di gBooks
                </span>
              </div>
              <h1 className="text-display leading-tight mb-6">
                Temukan Buku Impianmu
              </h1>
              <p className="text-body-large text-muted-foreground max-w-md">
                Koleksi lengkap buku dari berbagai genre, penulis, dan penerbit terbaik. Belanja sekarang dan nikmati pengalaman berbelanja yang menyenangkan.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => navigate("/catalog")}
              >
                Jelajahi Katalog
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/catalog")}
              >
                Lihat Penawaran
              </Button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-0 bg-accent/10 rounded-lg transform rotate-3"></div>
              <div className="relative bg-white border-2 border-foreground p-8 rounded-lg shadow-lg">
                <BookOpen className="w-32 h-32 text-accent mx-auto mb-6" />
                <p className="text-center text-sm font-semibold">
                  Ribuan Buku Menunggu Untuk Dibaca
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-spacing bg-background border-b border-border">
        <div className="container">
          <h2 className="text-heading mb-12 text-center">Mengapa Memilih gBooks?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Truck,
                title: "Pengiriman Cepat",
                description: "Pengiriman ke seluruh Indonesia dengan jaminan aman",
              },
              {
                icon: Award,
                title: "Harga Terbaik",
                description: "Harga kompetitif dengan kualitas buku terjamin",
              },
              {
                icon: Clock,
                title: "Layanan 24/7",
                description: "Tim customer service siap membantu kapan saja",
              },
              {
                icon: BookOpen,
                title: "Koleksi Lengkap",
                description: "Ribuan judul buku dari berbagai genre dan penulis",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="card-clean">
                  <Icon className="w-8 h-8 text-accent mb-4" />
                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories && categories.length > 0 && (
        <section className="section-spacing bg-background border-b border-border">
          <div className="container">
            <h2 className="text-heading mb-12">Jelajahi Kategori</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((category) => (
                <button
                  key={category.id}
                  onClick={() =>
                    navigate(`/catalog?category=${category.id}`)
                  }
                  className="p-6 bg-background border border-border hover:border-accent hover:bg-accent/5 transition-all text-center"
                >
                  <h4 className="font-semibold text-sm md:text-base">
                    {category.name}
                  </h4>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Books Section */}
      {featuredBooks && featuredBooks.length > 0 && (
        <section className="section-spacing bg-background border-b border-border">
          <div className="container">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-heading">Buku Unggulan</h2>
              <Button
                variant="ghost"
                onClick={() => navigate("/catalog")}
              >
                Lihat Semua →
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredBooks.map((book) => (
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
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-spacing bg-accent text-accent-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-heading text-accent-foreground">
            Siap Memulai Petualangan Membaca?
          </h2>
          <p className="text-body-large max-w-2xl mx-auto opacity-90">
            Jangan lewatkan koleksi terbaru dan penawaran spesial kami. Daftar sekarang untuk mendapatkan akses eksklusif.
          </p>
          <Button
            size="lg"
            className="bg-accent-foreground text-accent hover:bg-accent-foreground/90"
            onClick={() => navigate("/catalog")}
          >
            Mulai Belanja Sekarang
          </Button>
        </div>
      </section>
    </div>
  );
}
