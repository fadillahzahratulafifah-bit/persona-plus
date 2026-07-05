import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

export default function PromoPage() {
  const promos = [
    {
      id: 1,
      title: "Spesial Kemerdekaan",
      description: "Diskon hingga 45% untuk layanan Makeup Wedding dan Prewedding. Terbatas!",
      code: "MERDEKA45",
      valid: "31 Agustus 2026",
      image: "bg-red-500",
    },
    {
      id: 2,
      title: "Gajian Sale",
      description: "Potongan Rp 50.000 untuk sewa kostum anime premium.",
      code: "GAJIAN50",
      valid: "5 September 2026",
      image: "bg-blue-500",
    },
    {
      id: 3,
      title: "Pengguna Baru",
      description: "Diskon 20% tanpa minimum transaksi untuk booking pertama kali.",
      code: "PERSONA20",
      valid: "31 Desember 2026",
      image: "bg-primary",
    }
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold font-heading mb-4">Promo Spesial Persona+</h1>
        <p className="text-muted-foreground text-lg">Gunakan kode voucher di bawah ini untuk mendapatkan penawaran terbaik dari layanan vendor favoritmu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {promos.map(promo => (
          <div key={promo.id} className="bg-card border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
            <div className={`h-40 ${promo.image} relative overflow-hidden flex items-center justify-center`}>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              <Ticket className="w-16 h-16 text-white/50 relative z-10 -rotate-12 group-hover:rotate-0 transition-transform" />
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <h3 className="font-bold text-xl mb-2">{promo.title}</h3>
              <p className="text-muted-foreground text-sm mb-6 flex-1">{promo.description}</p>
              
              <div className="bg-muted/50 rounded-2xl p-4 border border-dashed flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Kode Voucher</span>
                  <span>Berlaku s/d {promo.valid}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-primary text-lg">{promo.code}</span>
                  <Button size="sm" variant="outline" className="rounded-xl h-8">Salin Kode</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
