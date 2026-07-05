"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Heart, Ticket, CalendarClock, LogOut, MessageSquare } from "lucide-react";

export default function CustomerSidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Profil Saya", icon: User, path: "/dashboard" },
    { name: "Riwayat Pesanan", icon: CalendarClock, path: "/dashboard/booking" },
    { name: "Pesan", icon: MessageSquare, path: "/dashboard/chat" },
    { name: "Voucher Promo", icon: Ticket, path: "/dashboard/vouchers" },
    { name: "Wishlist Tersimpan", icon: Heart, path: "/dashboard/wishlist" },
  ];

  return (
    <div className="w-full md:w-64 bg-card border rounded-2xl md:rounded-3xl p-4 shadow-sm h-fit">
      <div className="mb-6 px-4 pt-2 hidden md:block">
        <h3 className="font-bold text-lg font-heading">Akun Saya</h3>
      </div>
      
      <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-2 md:gap-1 pb-2 md:pb-0">
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

      <div className="mt-4 md:mt-8 pt-4 border-t">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm text-destructive hover:bg-destructive/10 w-full text-left">
          <LogOut className="w-5 h-5" />
          Keluar
        </button>
      </div>
    </div>
  );
}
