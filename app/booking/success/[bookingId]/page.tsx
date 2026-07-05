"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Clock, MapPin, ReceiptText } from "lucide-react";
import { OrderService, Order } from "@/services/order.service";

export default function BookingSuccessPage({ params: paramsPromise }: { params: Promise<{ bookingId: string }> }) {
  const params = use(paramsPromise);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    OrderService.getOrderById(params.bookingId).then((res) => {
      if (res.success && res.data) setOrder(res.data);
      setLoading(false);
    });
  }, [params.bookingId]);

  if (loading) return <div className="p-20 text-center">Memuat pesanan...</div>;
  if (!order) return <div className="p-20 text-center">Pesanan tidak ditemukan.</div>;

  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl text-center animate-in fade-in zoom-in duration-500">
      
      <div className="bg-card border rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-success/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          
          <h1 className="text-3xl font-bold font-heading mb-2">Booking Berhasil!</h1>
          <p className="text-muted-foreground mb-8">
            Pembayaran Anda telah diterima dan booking diteruskan ke vendor. Menunggu konfirmasi dari vendor.
          </p>

          <div className="bg-muted/50 rounded-2xl p-6 text-left mb-8 max-w-md mx-auto">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <span className="text-muted-foreground">ID Booking</span>
              <span className="font-bold font-mono text-primary">{params.bookingId}</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <ReceiptText className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">{order.serviceName}</p>
                  <p className="text-xs text-muted-foreground">{order.vendorName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">{order.date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">{order.time} WIB</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-primary">{order.total}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/booking">
              <Button size="lg" className="rounded-full w-full sm:w-auto px-8">Lihat Pesanan Saya</Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto px-8">Kembali ke Beranda</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
