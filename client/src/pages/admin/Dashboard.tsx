import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Book, Users, ShoppingCart, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { data: books } = trpc.books.list.useQuery({ limit: 1, offset: 0 });
  const { data: orders } = trpc.orders.listAll.useQuery({ limit: 1, offset: 0 });
  const { data: users } = trpc.users.list.useQuery({ limit: 1, offset: 0 });

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-heading mb-4">Akses Ditolak</h1>
          <p className="text-muted-foreground mb-6">
            Anda tidak memiliki akses ke halaman admin
          </p>
          <Button onClick={() => navigate("/")}>Kembali ke Beranda</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-heading mb-2">Dashboard Admin</h1>
          <p className="text-muted-foreground">
            Kelola toko buku Anda dari sini
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Total Buku</h3>
              <Book className="w-5 h-5 text-accent" />
            </div>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground mt-2">
              Koleksi lengkap
            </p>
          </div>

          <div className="border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Total Pesanan</h3>
              <ShoppingCart className="w-5 h-5 text-accent" />
            </div>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground mt-2">
              Pesanan aktif
            </p>
          </div>

          <div className="border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Total Pengguna</h3>
              <Users className="w-5 h-5 text-accent" />
            </div>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground mt-2">
              Pengguna terdaftar
            </p>
          </div>

          <div className="border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Pendapatan</h3>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <p className="text-3xl font-bold">Rp 0</p>
            <p className="text-sm text-muted-foreground mt-2">
              Bulan ini
            </p>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Manajemen Buku",
              description: "Tambah, edit, atau hapus buku dari katalog",
              icon: Book,
              href: "/admin/books",
            },
            {
              title: "Manajemen Pesanan",
              description: "Lihat dan kelola status pesanan pelanggan",
              icon: ShoppingCart,
              href: "/admin/orders",
            },
            {
              title: "Manajemen Pengguna",
              description: "Kelola data pengguna dan role akses",
              icon: Users,
              href: "/admin/users",
            },
            {
              title: "Laporan & Analytics",
              description: "Lihat statistik penjualan dan performa toko",
              icon: TrendingUp,
              href: "#",
            },
          ].map((section, idx) => {
            const Icon = section.icon;
            return (
              <button
                key={idx}
                onClick={() => section.href !== "#" && navigate(section.href)}
                disabled={section.href === "#"}
                className="border border-border p-6 text-left hover:border-accent hover:bg-accent/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
                {section.href !== "#" && (
                  <div className="mt-4 flex items-center text-accent text-sm font-medium">
                    Buka →
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
