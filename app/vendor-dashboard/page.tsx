"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { OrderService, Order } from "@/services/order.service";
import { DollarSign, CalendarCheck, CheckCircle2, Package } from "lucide-react";

export default function VendorDashboardOverview() {
  const user = useAuthStore(state => state.user);
  const [recentBookings, setRecentBookings] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: "Rp 0",
    activeBookings: 0,
    completedBookings: 0,
    totalServices: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      OrderService.getVendorOrders(user.id).then(res => {
        if (res.success && res.data) {
          const orders = res.data;
          
          let revenue = 0;
          let active = 0;
          let completed = 0;

          orders.forEach(order => {
            if (order.status === 'completed') {
              completed++;
              // parse price "Rp 500.000" to number
              const price = parseInt(order.total.replace(/[^0-9]/g, "")) || 0;
              revenue += price;
            } else if (order.status === 'pending' || order.status === 'confirmed') {
              active++;
            }
          });

          setStats({
            totalRevenue: `Rp ${revenue.toLocaleString('id-ID')}`,
            activeBookings: active,
            completedBookings: completed,
            totalServices: 0 // real app would query services collection
          });
          setRecentBookings(orders.slice(0, 5)); // show top 5
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div className="p-20 text-center">Memuat dashboard...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Ringkasan performa bisnis Anda bulan ini.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Total Pendapatan</p>
            <h3 className="text-2xl font-bold">{stats.totalRevenue}</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Pesanan Aktif</p>
            <h3 className="text-2xl font-bold">{stats.activeBookings}</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Pesanan Selesai</p>
            <h3 className="text-2xl font-bold">{stats.completedBookings}</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Total Layanan</p>
            <h3 className="text-2xl font-bold">{stats.totalServices}</h3>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="font-bold text-lg">Pesanan Terbaru</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4">ID Booking</th>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Layanan</th>
                <th className="px-6 py-4">Jadwal</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-muted-foreground">{booking.id}</td>
                  <td className="px-6 py-4 font-medium">{booking.customerName}</td>
                  <td className="px-6 py-4">{booking.serviceName}</td>
                  <td className="px-6 py-4">{booking.date} {booking.time}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      booking.status === 'pending' ? 'bg-warning/10 text-warning' :
                      booking.status === 'confirmed' ? 'bg-success/10 text-success' :
                      booking.status === 'completed' ? 'bg-primary/10 text-primary' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">Belum ada pesanan terbaru.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
