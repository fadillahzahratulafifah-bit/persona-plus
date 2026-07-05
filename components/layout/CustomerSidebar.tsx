"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Heart, Ticket, CalendarClock, LogOut, MessageSquare } from "lucide-react";
import { useAuthStore } from "@/store/auth";

export default function CustomerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/");
    router.refresh();
  };

  const menu = [
    { name: "Profil Saya", icon: User, path: "/dashboard" },
    { name: "Riwayat Pesanan", icon: CalendarClock, path: "/dashboard/booking" },
    { name: "Pesan", icon: MessageSquare, path: "/dashboard/chat" },
    { name: "Voucher Promo", icon: Ticket, path: "/dashboard/vouchers" },
    { name: "Wishlist Tersimpan", icon: Heart, path: "/dashboard/wishlist" },
  ];

  return (
    <div className="w-full md:w-64 bg-card border rounded-2xl md:rounded-3xl shadow-sm h-fit">
      {/* User Info */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-base shrink-0">
            {(user?.name || 'U')[0].toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user?.name || 'Pengguna'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
          </div>
        </div>
      </div>
      
      <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-1 p-3">
        {menu.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm whitespace-nowrap ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm text-destructive hover:bg-destructive/10 w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          Keluar
        </button>
      </div>
    </div>
  );
}
