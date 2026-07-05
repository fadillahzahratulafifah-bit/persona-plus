"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { OrderService, Order, OrderStatus } from "@/services/order.service";
import { Clock, Calendar, CheckCircle2, XCircle, CheckCheck, ChevronRight, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Star } from "lucide-react";

export default function BookingHistoryPage() {
  const user = useAuthStore(state => state.user);
  const [bookings, setBookings] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const [ratingOrder, setRatingOrder] = useState<Order | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);

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

  const handleSubmitRating = async () => {
    if (!ratingOrder) return;
    setSubmittingRating(true);
    try {
      const res = await OrderService.addRatingToOrder(ratingOrder.id, ratingValue, reviewText);
      if (res.success) {
        setBookings(prev => prev.map(b => b.id === ratingOrder.id ? { ...b, rating: ratingValue, review: reviewText } : b));
        setRatingOrder(null);
        setRatingValue(5);
        setReviewText("");
        alert("Terima kasih atas ulasan Anda!");
      } else {
        alert("Gagal mengirim ulasan.");
      }
    } catch {
      alert("Terjadi kesalahan.");
    } finally {
      setSubmittingRating(false);
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
                    {booking.status === 'completed' && !booking.rating && (
                      <Button 
                        size="sm" 
                        onClick={() => setRatingOrder(booking)} 
                        className="rounded-full text-xs"
                      >
                        <Star className="w-3 h-3 mr-1" /> Beri Rating
                      </Button>
                    )}
                    {booking.rating && (
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1.5 rounded-full border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-500" /> {booking.rating}
                      </div>
                    )}
                    {booking.status !== 'completed' && (
                      <Link href={`/vendors/${booking.vendorId}`}>
                        <Button size="sm" variant="outline" className="rounded-full text-xs">
                          Lihat Vendor <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rating Modal */}
      {ratingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-background rounded-3xl p-6 w-full max-w-md shadow-xl animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-xl mb-1">Beri Nilai Vendor</h3>
            <p className="text-sm text-muted-foreground mb-6">Bagaimana pengalaman Anda menggunakan layanan {ratingOrder.vendorName}?</p>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  onClick={() => setRatingValue(star)}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <Star className={`w-10 h-10 ${ratingValue >= star ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                </button>
              ))}
            </div>

            <textarea
              className="w-full p-4 border rounded-2xl bg-muted/30 focus:ring-2 focus:ring-primary focus:outline-none resize-none mb-6 text-sm"
              placeholder="Tulis ulasan pengalaman Anda (opsional)..."
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setRatingOrder(null)} className="rounded-full">Batal</Button>
              <Button onClick={handleSubmitRating} disabled={submittingRating} className="rounded-full px-8">Kirim Ulasan</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
