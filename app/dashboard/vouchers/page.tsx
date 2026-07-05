"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Ticket, Copy, CheckCircle2, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const q = query(
          collection(db, "vouchers"),
          where("isActive", "==", true),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        const now = new Date();
        const activeVouchers = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as any))
          .filter(v => !v.expiresAt || new Date(v.expiresAt) >= now);

        setVouchers(activeVouchers);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVouchers();
  }, []);

  const formatRupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

  const getVoucherDesc = (v: any) => {
    let desc = `Potongan ${v.type === 'percentage' ? `${v.value}%` : formatRupiah(v.value)}.`;
    if (v.maxDiscount) desc += ` Maksimal potongan ${formatRupiah(v.maxDiscount)}.`;
    return desc;
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Kode ${code} berhasil disalin!`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">Voucher Saya</h1>
        <p className="text-muted-foreground">Klaim dan gunakan voucher untuk menghemat transaksi Anda.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : vouchers.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl border border-dashed shadow-sm">
          <Ticket className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Belum ada promo saat ini</h3>
          <p className="text-muted-foreground">Promo yang tersedia akan muncul di sini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vouchers.map(voucher => (
            <div key={voucher.id} className="bg-card shadow-sm hover:border-primary/50 transition-colors border rounded-3xl p-6 flex flex-col relative overflow-hidden">
              
              {/* Decoration */}
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl bg-primary/20"></div>
              
              <div className="flex items-start gap-4 mb-4 relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                  <Ticket className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg leading-tight mb-1">{voucher.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {voucher.minPurchase ? `Min. belanja ${formatRupiah(voucher.minPurchase)}` : "Tanpa minimum belanja"}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-foreground/80 mb-6 flex-1 relative z-10">{getVoucherDesc(voucher)}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-dashed relative z-10">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Berlaku Hingga</p>
                  <p className="text-sm font-bold text-foreground">
                    {voucher.expiresAt ? new Date(voucher.expiresAt).toLocaleDateString('id-ID') : 'Tanpa batas waktu'}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold bg-muted px-3 py-1.5 rounded-lg border">{voucher.code}</span>
                  <Button onClick={() => handleCopyCode(voucher.code)} variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
