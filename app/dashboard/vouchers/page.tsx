import { Button } from "@/components/ui/button";
import { Ticket, Copy, CheckCircle2 } from "lucide-react";

export default function VouchersPage() {
  const vouchers = [
    {
      id: "v1",
      code: "PERSONA20",
      title: "Diskon Pengguna Baru",
      desc: "Potongan Rp 20.000 untuk transaksi pertama Anda di Persona+.",
      minPurchase: "Tanpa minimum belanja",
      validUntil: "31 Des 2026",
      isUsed: false,
    },
    {
      id: "v2",
      code: "WEDDINGPRO",
      title: "Spesial Makeup Wedding",
      desc: "Diskon 10% maksimal Rp 100.000 khusus layanan kategori Wedding.",
      minPurchase: "Min. belanja Rp 1.000.000",
      validUntil: "15 Agu 2026",
      isUsed: false,
    },
    {
      id: "v3",
      code: "COSPLAY10",
      title: "Promo Sewa Kostum",
      desc: "Potongan Rp 10.000 untuk penyewaan kostum anime apa saja.",
      minPurchase: "Tanpa minimum belanja",
      validUntil: "Kadaluarsa",
      isUsed: true,
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">Voucher Saya</h1>
        <p className="text-muted-foreground">Klaim dan gunakan voucher untuk menghemat transaksi Anda.</p>
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Masukkan kode promo..." 
          className="flex-1 max-w-sm px-4 py-2 border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button className="rounded-xl px-6">Klaim</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vouchers.map(voucher => (
          <div key={voucher.id} className={`border rounded-3xl p-6 flex flex-col relative overflow-hidden ${voucher.isUsed ? 'bg-muted/50 opacity-70' : 'bg-card shadow-sm hover:border-primary/50 transition-colors'}`}>
            
            {/* Decoration */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl ${voucher.isUsed ? 'bg-muted-foreground/20' : 'bg-primary/20'}`}></div>
            
            <div className="flex items-start gap-4 mb-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${voucher.isUsed ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                <Ticket className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg leading-tight mb-1">{voucher.title}</h3>
                <p className="text-xs text-muted-foreground">{voucher.minPurchase}</p>
              </div>
            </div>
            
            <p className="text-sm text-foreground/80 mb-6 flex-1 relative z-10">{voucher.desc}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-dashed relative z-10">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Berlaku Hingga</p>
                <p className={`text-sm font-bold ${voucher.isUsed ? 'text-muted-foreground' : 'text-foreground'}`}>{voucher.validUntil}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold bg-muted px-3 py-1.5 rounded-lg border">{voucher.code}</span>
                {!voucher.isUsed && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {voucher.isUsed && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center z-20">
                <div className="bg-background border px-4 py-2 rounded-full font-bold text-muted-foreground flex items-center gap-2 shadow-sm">
                  <CheckCircle2 className="w-4 h-4" /> Tidak Berlaku
                </div>
              </div>
            )}
            
          </div>
        ))}
      </div>
    </div>
  );
}
