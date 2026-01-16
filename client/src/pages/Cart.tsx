import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  id: number;
  title: string;
  price: string | number;
  coverImageUrl?: string;
  quantity: number;
}

export default function Cart() {
  const [, navigate] = useLocation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
    setIsLoading(false);
  }, []);

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id: number) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    toast.success("Item dihapus dari keranjang");
  };

  const total = cart.reduce(
    (sum, item) => sum + parseFloat(item.price.toString()) * item.quantity,
    0
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 bg-muted"></div>
            <div className="h-64 bg-muted"></div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-heading mb-2">Keranjang Kosong</h1>
          <p className="text-muted-foreground mb-6">
            Belum ada buku di keranjang Anda. Mulai belanja sekarang!
          </p>
          <Button onClick={() => navigate("/catalog")}>
            Lanjut Belanja
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
          Lanjut Belanja
        </button>

        <h1 className="text-heading mb-8">Keranjang Belanja</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="border border-border p-6 flex gap-6 items-start"
              >
                {/* Image */}
                <div className="w-20 h-28 bg-muted border border-border flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {item.coverImageUrl ? (
                    <img
                      src={item.coverImageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-accent font-bold mb-4">
                    Rp{" "}
                    {parseFloat(item.price.toString()).toLocaleString(
                      "id-ID"
                    )}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-border rounded">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-3 py-1 hover:bg-muted/50 transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.id,
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        className="w-12 text-center border-l border-r border-border py-1 outline-none text-sm"
                        min="1"
                      />
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1 hover:bg-muted/50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="border border-border p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-6">Ringkasan Pesanan</h3>

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

              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-accent">
                  Rp {total.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
                </span>
              </div>

              <Button
                size="lg"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => navigate("/checkout")}
              >
                Lanjut ke Checkout
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full mt-3"
                onClick={() => navigate("/catalog")}
              >
                Lanjut Belanja
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
