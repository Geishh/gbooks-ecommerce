import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

interface CartItem {
  id: number;
  title: string;
  price: string | number;
  quantity: number;
}

export default function Checkout() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    shippingAddress: "",
    shippingCity: "",
    shippingZip: "",
    shippingPhone: "",
    notes: "",
  });

  const createOrderMutation = trpc.orders.create.useMutation();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Silakan login terlebih dahulu");
      navigate("/");
      return;
    }

    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (storedCart.length === 0) {
      navigate("/cart");
      return;
    }
    setCart(storedCart);
  }, [isAuthenticated, navigate]);

  const total = cart.reduce(
    (sum, item) => sum + parseFloat(item.price.toString()) * item.quantity,
    0
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.shippingAddress || !formData.shippingCity || !formData.shippingZip || !formData.shippingPhone) {
      toast.error("Silakan isi semua field yang diperlukan");
      return;
    }

    setIsLoading(true);

    try {
      const orderId = await createOrderMutation.mutateAsync({
        items: cart.map((item) => ({
          bookId: item.id,
          quantity: item.quantity,
          price: item.price.toString(),
        })),
        totalPrice: total.toString(),
        shippingAddress: formData.shippingAddress,
        shippingCity: formData.shippingCity,
        shippingZip: formData.shippingZip,
        shippingPhone: formData.shippingPhone,
        notes: formData.notes,
      });

      localStorage.removeItem("cart");
      toast.success("Pesanan berhasil dibuat!");
      navigate("/order-success");
    } catch (error) {
      toast.error("Gagal membuat pesanan. Silakan coba lagi.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 md:py-12">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Keranjang
        </button>

        <h1 className="text-heading mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Address */}
              <div className="border border-border p-6">
                <h3 className="font-semibold text-lg mb-4">Alamat Pengiriman</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Alamat Lengkap *
                    </label>
                    <Input
                      type="text"
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      placeholder="Jl. Contoh No. 123"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Kota/Kabupaten *
                      </label>
                      <Input
                        type="text"
                        name="shippingCity"
                        value={formData.shippingCity}
                        onChange={handleInputChange}
                        placeholder="Jakarta"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Kode Pos *
                      </label>
                      <Input
                        type="text"
                        name="shippingZip"
                        value={formData.shippingZip}
                        onChange={handleInputChange}
                        placeholder="12345"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nomor Telepon *
                    </label>
                    <Input
                      type="tel"
                      name="shippingPhone"
                      value={formData.shippingPhone}
                      onChange={handleInputChange}
                      placeholder="081234567890"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="border border-border p-6">
                <h3 className="font-semibold text-lg mb-4">Catatan Pesanan</h3>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Catatan tambahan untuk pesanan Anda (opsional)"
                  className="w-full border border-border p-3 rounded text-sm resize-none h-24 outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Payment Method */}
              <div className="border border-border p-6">
                <h3 className="font-semibold text-lg mb-4">Metode Pembayaran</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-border rounded cursor-pointer hover:bg-muted/50">
                    <input
                      type="radio"
                      name="payment"
                      value="simulation"
                      defaultChecked
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">
                      Simulasi Pembayaran
                    </span>
                  </label>
                  <p className="text-xs text-muted-foreground px-3">
                    Pesanan akan diproses setelah pembayaran dikonfirmasi
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Selesaikan Pesanan"}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-border p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-6">Ringkasan Pesanan</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.title} x{item.quantity}
                    </span>
                    <span>
                      Rp{" "}
                      {(
                        parseFloat(item.price.toString()) * item.quantity
                      ).toLocaleString("id-ID", { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>
                    Rp {total.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Biaya Pengiriman</span>
                  <span>Rp 0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pajak</span>
                  <span>Rp 0</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-accent">
                  Rp {total.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
                </span>
              </div>

              {/* User Info */}
              <div className="mt-6 pt-6 border-t border-border text-sm">
                <p className="text-muted-foreground mb-2">Nama Pemesan:</p>
                <p className="font-medium">{user?.name || "User"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
