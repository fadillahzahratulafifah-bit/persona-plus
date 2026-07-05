"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { OrderService, Order, OrderStatus } from "@/services/order.service";
import { Clock, Calendar, CheckCircle2, XCircle, CheckCheck, ChevronRight, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function BookingHistoryPage() {
  const user = useAuthStore(state => state.user);
  const [bookings, setBookings] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (user) {
      OrderService.getCustomerOrders(user.id).then(res => {
        if (res.success) setBookings(res.data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleCancel = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) return;
    try {
      await updateDoc(doc(db, "orders", id), { status: 'cancelled' });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' as OrderStatus } : b));
    } catch {
      alert("Gagal membatalkan pesanan.");
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-warning/15 text-warning rounded-full text-xs font-bold"><Clock className="w-3 h-3"/>Menunggu Konfirmasi</span>;
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-success/15 text-success rounded-full text-xs font-bold"><CheckCircle2 className="w-3 h-3"/>Dikonfirmasi</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/15 text-primary rounded-full text-xs font-bold"><CheckCheck className="w-3 h-3"/>Selesai</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-destructive/15 text-destructive rounded-full text-xs font-bold"><XCircle className="w-3 h-3"/>Dibatalkan</span>;
      default:
        return <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">Riwayat Pesanan</h1>
        <p className="text-muted-foreground">Pantau status booking jasa dan sewa kostum Anda.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all", label: "Semua" },
          { key: "pending", label: "Menunggu" },
          { key: "confirmed", label: "Dikonfirmasi" },
          { key: "completed", label: "Selesai" },
          { key: "cancelled", label: "Dibatalkan" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === tab.key ? 'bg-primary text-primary-foreground' : 'bg-card border hover:bg-muted'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center">Memuat riwayat pesanan...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-card border rounded-3xl flex flex-col items-center gap-4">
          <PackageSearch className="w-16 h-16 text-muted-foreground/50" />
          <p className="text-muted-foreground">Belum ada pesanan {filter !== 'all' ? `dengan status ini` : 'sama sekali'}.</p>
          <Link href="/vendors">
            <Button className="rounded-full">Cari Layanan Sekarang</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(booking => (
            <div key={booking.id} className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:border-primary/30 transition-colors">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 bg-muted/30 border-b">
                <span className="text-xs font-mono text-muted-foreground">{booking.id}</span>
                {getStatusBadge(booking.status as OrderStatus)}
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-bold text-lg">{booking.serviceName}</h3>
                    <p className="text-sm text-muted-foreground">oleh <span className="font-medium text-foreground">{booking.vendorName}</span></p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(booking.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-4 h-4" /> {booking.time} WIB
                    </span>
                  </div>
                  {booking.note && (
                    <p className="text-sm text-muted-foreground italic">"{booking.note}"</p>
                  )}
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 md:gap-3 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-6">
                  <div className="md:text-right">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-bold text-primary text-lg">{booking.total}</p>
                  </div>

                  <div className="flex gap-2">
                    {booking.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full text-destructive border-destructive/40 hover:bg-destructive hover:text-white text-xs"
                        onClick={() => handleCancel(booking.id)}
                      >
                        Batalkan
                      </Button>
                    )}
                    <Link href={`/vendors/${booking.vendorId}`}>
                      <Button size="sm" variant="outline" className="rounded-full text-xs">
                        Lihat Vendor <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
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
