"use client";

import Link from "next/link";
import { useOrderStore } from "@/store/order";
import { Clock, Calendar, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookingHistoryPage() {
  const getCustomerOrders = useOrderStore((state) => state.getCustomerOrders);
  const bookings = getCustomerOrders("cust-1");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-3 py-1 bg-success/10 text-success rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Dikonfirmasi</span>;
      case 'completed':
        return <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">Selesai</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-warning/10 text-warning rounded-full text-xs font-bold">Menunggu</span>;
      case 'cancelled':
        return <span className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-bold">Dibatalkan</span>;
      default:
        return <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">Riwayat Pesanan</h1>
        <p className="text-muted-foreground">Pantau status booking jasa dan sewa kostum Anda.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="py-20 text-center bg-card border rounded-3xl">
          <p className="text-muted-foreground mb-4">Anda belum memiliki riwayat pesanan.</p>
          <Link href="/vendors"><Button className="rounded-full">Cari Layanan</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-card border rounded-2xl p-5 hover:border-primary/50 transition-colors flex flex-col md:flex-row gap-6 md:items-center justify-between shadow-sm">
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between md:justify-start gap-4">
                  <span className="text-xs text-muted-foreground font-mono">{booking.id}</span>
                  {getStatusBadge(booking.status)}
                </div>
                
                <div>
                  <h3 className="font-bold text-lg">{booking.serviceName}</h3>
                  <p className="text-sm text-muted-foreground">{booking.vendorName}</p>
                </div>
                
                <div className="flex items-center gap-4 text-sm font-medium">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-muted-foreground"/> {booking.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-muted-foreground"/> {booking.time}</span>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                <div>
                  <p className="text-xs text-muted-foreground md:text-right mb-1">Total Belanja</p>
                  <p className="font-bold text-primary text-lg">{booking.total}</p>
                </div>
                
                {booking.status === 'confirmed' ? (
                  <Button className="w-full md:w-auto rounded-full bg-success hover:bg-success/90">
                    Selesaikan Pesanan
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full md:w-auto rounded-full flex items-center gap-2">
                    Lihat Detail <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
