"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { OrderService, Order, OrderStatus } from "@/services/order.service";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { CheckCircle2, Clock, XCircle, CheckCheck, Calendar, User, MessageSquare, DollarSign } from "lucide-react";

export default function BookingsManagementPage() {
  const user = useAuthStore(state => state.user);
  const [bookings, setBookings] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (user) {
      OrderService.getVendorOrders(user.id).then(res => {
        if (res.success) setBookings(res.data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleUpdateStatus = async (id: string, status: OrderStatus) => {
    try {
      await updateDoc(doc(db, "orders", id), { status });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Gagal mengupdate status pesanan.");
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-warning/15 text-warning rounded-full text-xs font-bold"><Clock className="w-3 h-3"/>Menunggu</span>;
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-success/15 text-success rounded-full text-xs font-bold"><CheckCircle2 className="w-3 h-3"/>Dikonfirmasi</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/15 text-primary rounded-full text-xs font-bold"><CheckCheck className="w-3 h-3"/>Selesai</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-destructive/15 text-destructive rounded-full text-xs font-bold"><XCircle className="w-3 h-3"/>Dibatalkan</span>;
      default:
        return <span className="px-3 py-1 bg-muted rounded-full text-xs">{status}</span>;
    }
  };

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);
  const stats = {
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">Pesanan Masuk</h1>
        <p className="text-muted-foreground">Terima, kelola, dan selesaikan pesanan dari pelanggan.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Menunggu", value: stats.pending, color: "text-warning", bg: "bg-warning/10" },
          { label: "Dikonfirmasi", value: stats.confirmed, color: "text-success", bg: "bg-success/10" },
          { label: "Selesai", value: stats.completed, color: "text-primary", bg: "bg-primary/10" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-bold font-heading ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
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
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === tab.key ? 'bg-primary text-primary-foreground' : 'bg-card border hover:bg-muted text-foreground'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center">Memuat pesanan masuk...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-card border rounded-3xl">
          <p className="text-muted-foreground">Belum ada pesanan {filter !== 'all' ? `dengan status "${filter}"` : ''}.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(booking => (
            <div key={booking.id} className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:border-primary/30 transition-colors">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground">{booking.id}</span>
                  {getStatusBadge(booking.status as OrderStatus)}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(booking.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Layanan</p>
                      <p className="font-semibold text-sm">{booking.serviceName}</p>
                      <p className="font-bold text-primary">{booking.total}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Pelanggan</p>
                      <p className="font-semibold text-sm">{booking.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Tanggal & Waktu</p>
                      <p className="font-semibold text-sm">{booking.date}</p>
                      <p className="text-sm text-muted-foreground">{booking.time} WIB</p>
                    </div>
                  </div>
                  {booking.note && (
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Catatan</p>
                        <p className="font-semibold text-sm">{booking.note}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end border-t pt-4">
                  {booking.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        className="rounded-full bg-success hover:bg-success/90 text-white"
                        onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Terima Pesanan
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full text-destructive border-destructive/40 hover:bg-destructive hover:text-white"
                        onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Tolak
                      </Button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <Button
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleUpdateStatus(booking.id, 'completed')}
                    >
                      <CheckCheck className="w-4 h-4 mr-1" /> Tandai Selesai
                    </Button>
                  )}
                  {(booking.status === 'completed' || booking.status === 'cancelled') && (
                    <span className="text-xs text-muted-foreground self-center">Pesanan sudah final.</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
