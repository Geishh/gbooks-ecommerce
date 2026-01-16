import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function AdminOrders() {
  const [, navigate] = useLocation();
  const { data: orders, refetch } = trpc.orders.listAll.useQuery({ limit: 50 });
  const updateStatusMutation = trpc.orders.updateStatus.useMutation();

  const handleStatusChange = async (
    orderId: number,
    newStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: orderId,
        status: newStatus,
      });
      toast.success("Status pesanan berhasil diperbarui");
      refetch();
    } catch (error) {
      toast.error("Gagal memperbarui status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-50 text-green-700";
      case "shipped":
        return "bg-blue-50 text-blue-700";
      case "processing":
        return "bg-yellow-50 text-yellow-700";
      case "cancelled":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu";
      case "processing":
        return "Diproses";
      case "shipped":
        return "Dikirim";
      case "delivered":
        return "Diterima";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/admin")}
            className="p-2 hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-heading">Manajemen Pesanan</h1>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.id}
                className="border border-border p-6 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium mb-2">Alamat Pengiriman:</p>
                  <p className="text-sm text-muted-foreground">
                    {order.shippingAddress}, {order.shippingCity}{" "}
                    {order.shippingZip}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Telepon: {order.shippingPhone}
                  </p>
                </div>

                {/* Status Update */}
                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium mb-3">Ubah Status:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "pending",
                      "processing",
                      "shipped",
                      "delivered",
                      "cancelled",
                    ].map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          handleStatusChange(
                            order.id,
                            status as any
                          )
                        }
                        disabled={order.status === status}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          order.status === status
                            ? "bg-accent text-accent-foreground"
                            : "border border-border hover:border-accent"
                        }`}
                      >
                        {getStatusLabel(status)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Belum ada pesanan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
