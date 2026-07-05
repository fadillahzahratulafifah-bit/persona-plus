"use client";

import { useOrderStore, OrderStatus } from "@/store/order";
import { Button } from "@/components/ui/button";

export default function BookingsManagementPage() {
  const getVendorOrders = useOrderStore(state => state.getVendorOrders);
  const updateOrderStatus = useOrderStore(state => state.updateOrderStatus);
  
  // Dummy Vendor ID
  const bookings = getVendorOrders("vendor-1");

  const handleUpdateStatus = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">Kelola Pesanan</h1>
        <p className="text-muted-foreground">Terima atau tolak pesanan yang masuk dari pelanggan.</p>
      </div>

      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4">Pesanan</th>
                <th className="px-6 py-4">Jadwal</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold">{booking.serviceName}</p>
                    <p className="text-xs text-muted-foreground">{booking.customerName} • {booking.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{booking.date}</p>
                    <p className="text-xs text-muted-foreground">{booking.time}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      booking.status === 'pending' ? 'bg-warning/10 text-warning' :
                      booking.status === 'confirmed' ? 'bg-success/10 text-success' :
                      booking.status === 'completed' ? 'bg-primary/10 text-primary' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {booking.status === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => handleUpdateStatus(booking.id, 'confirmed')} className="bg-success hover:bg-success/90 text-success-foreground">Terima</Button>
                        <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(booking.id, 'cancelled')} className="text-destructive hover:bg-destructive/10 border-destructive/20">Tolak</Button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <Button size="sm" onClick={() => handleUpdateStatus(booking.id, 'completed')}>Selesaikan</Button>
                    )}
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">Belum ada pesanan masuk.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
