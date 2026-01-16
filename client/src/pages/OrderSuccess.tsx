import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12">
      <div className="container max-w-md text-center space-y-8">
        <div className="flex justify-center">
          <CheckCircle className="w-20 h-20 text-green-600" />
        </div>

        <div className="space-y-4">
          <h1 className="text-heading">Pesanan Berhasil Dibuat!</h1>
          <p className="text-body text-muted-foreground">
            Terima kasih telah berbelanja di gBooks. Pesanan Anda telah kami terima dan sedang diproses.
          </p>
          <p className="text-body text-muted-foreground">
            Anda akan menerima email konfirmasi dengan nomor pesanan dan detail pengiriman.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => navigate("/orders")}
          >
            Lihat Pesanan Saya
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => navigate("/catalog")}
          >
            Lanjut Belanja
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full"
            onClick={() => navigate("/")}
          >
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
}
