import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Package } from "lucide-react";

export default function UserOrders() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const { data: orders, isLoading } = trpc.orders.getUserOrders.useQuery(
    { limit: 20, offset: 0 },
    { enabled: isAuthenticated }
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-heading mb-4">Silakan Login Terlebih Dahulu</h1>
          <p className="text-muted-foreground mb-6">
            Anda perlu login untuk melihat riwayat pesanan Anda
          </p>
          <Button onClick={() => navigate("/")}>Kembali ke Beranda</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 bg-muted"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-muted"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 md:py-12">
        <h1 className="text-heading mb-8">Pesanan Saya</h1>

        {!orders || orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-6">
              Anda belum memiliki pesanan
            </p>
            <Button onClick={() => navigate("/catalog")}>
              Mulai Belanja
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-border p-6 hover:border-accent transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      No. Pesanan
                    </p>
                    <p className="font-semibold">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Tanggal
                    </p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total</p>
                    <p className="font-bold text-accent">
                      Rp{" "}
                      {parseFloat(order.totalPrice.toString()).toLocaleString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        order.status === "delivered"
                          ? "bg-green-50 text-green-700"
                          : order.status === "shipped"
                          ? "bg-blue-50 text-blue-700"
                          : order.status === "processing"
                          ? "bg-yellow-50 text-yellow-700"
                          : order.status === "cancelled"
                          ? "bg-red-50 text-red-700"
                          : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {order.status === "pending"
                        ? "Menunggu"
                        : order.status === "processing"
                        ? "Diproses"
                        : order.status === "shipped"
                        ? "Dikirim"
                        : order.status === "delivered"
                        ? "Diterima"
                        : "Dibatalkan"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
