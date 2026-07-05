"use client";

import VendorSidebar from "@/components/layout/VendorSidebar";
import { Bell, UserCircle, ShoppingBag } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useEffect, useState } from "react";
import { OrderService } from "@/services/order.service";
import Link from "next/link";

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore(state => state.user);
  const [pendingCount, setPendingCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    if (user) {
      OrderService.getVendorOrders(user.id).then(res => {
        if (res.success) {
          setPendingCount(res.data.filter(o => o.status === 'pending').length);
        }
      });
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-muted/30">
      <VendorSidebar />
      
      <div className="pl-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-card border-b px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="font-medium text-muted-foreground text-sm">
            Selamat datang,{" "}
            <span className="font-bold text-foreground">{user?.name || "Vendor"}</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotif(v => !v)}
                className="relative p-2 rounded-xl text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
              >
                <Bell className="w-5 h-5" />
                {pendingCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                    {pendingCount}
                  </span>
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-card border rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b font-bold text-sm flex justify-between">
                    <span>Notifikasi</span>
                    <button onClick={() => setShowNotif(false)} className="text-muted-foreground text-xs hover:text-foreground">Tutup</button>
                  </div>
                  {pendingCount === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">Tidak ada notifikasi baru</div>
                  ) : (
                    <Link href="/vendor-dashboard/bookings" onClick={() => setShowNotif(false)}>
                      <div className="p-4 hover:bg-muted/50 cursor-pointer flex items-center gap-3">
                        <div className="w-9 h-9 bg-warning/15 text-warning rounded-full flex items-center justify-center shrink-0">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{pendingCount} pesanan baru menunggu</p>
                          <p className="text-xs text-muted-foreground">Klik untuk melihat</p>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="h-8 w-px bg-border"></div>
            <Link href="/vendor-dashboard/settings" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                {(user?.name || 'V')[0].toUpperCase()}
              </div>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
