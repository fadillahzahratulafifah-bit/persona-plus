"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Ticket, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export default function PromoPage() {
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const q = query(
          collection(db, "vouchers"),
          where("isActive", "==", true),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        
        // Filter out expired client-side to be safe
        const now = new Date();
        const activePromos = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as any))
          .filter(p => !p.expiresAt || new Date(p.expiresAt) >= now);

        setPromos(activePromos);
      } catch (error) {
        console.error("Error fetching promos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromos();
  }, []);

  const formatRupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

  const getPromoDescription = (promo: any) => {
    let desc = `Diskon ${promo.type === 'percentage' ? `${promo.value}%` : formatRupiah(promo.value)}.`;
    if (promo.maxDiscount) desc += ` Maksimal potongan ${formatRupiah(promo.maxDiscount)}.`;
    if (promo.minPurchase) desc += ` Minimal belanja ${formatRupiah(promo.minPurchase)}.`;
    return desc;
  };

  const getRandomColorClass = (index: number) => {
    const colors = ["bg-primary", "bg-blue-500", "bg-red-500", "bg-green-500", "bg-purple-500"];
    return colors[index % colors.length];
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Kode ${code} berhasil disalin!`);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 pt-24 pb-12 animate-in fade-in duration-500 min-h-screen">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold font-heading mb-4">Promo Spesial Persona+</h1>
        <p className="text-muted-foreground text-lg">Gunakan kode voucher di bawah ini untuk mendapatkan penawaran terbaik dari layanan vendor favoritmu.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : promos.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed">
          <Ticket className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Belum ada promo saat ini</h3>
          <p className="text-muted-foreground">Nantikan kejutan promo menarik dari kami selanjutnya!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promos.map((promo, index) => (
            <div key={promo.id} className="bg-card border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              <div className={`h-40 ${getRandomColorClass(index)} relative overflow-hidden flex items-center justify-center`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <Ticket className="w-16 h-16 text-white/50 relative z-10 -rotate-12 group-hover:rotate-0 transition-transform" />
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-xl mb-2">{promo.title}</h3>
                <p className="text-muted-foreground text-sm mb-6 flex-1">{getPromoDescription(promo)}</p>
                
                <div className="bg-muted/50 rounded-2xl p-4 border border-dashed flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Kode Voucher</span>
                    <span>{promo.expiresAt ? `Berlaku s/d ${new Date(promo.expiresAt).toLocaleDateString('id-ID')}` : 'Tanpa batas waktu'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-primary text-lg">{promo.code}</span>
                    <Button onClick={() => handleCopyCode(promo.code)} size="sm" variant="outline" className="rounded-xl h-8">Salin Kode</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
