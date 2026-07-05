"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarCheck, Package, Shirt, Settings, LogOut, Store, MessageSquare } from "lucide-react";

export default function VendorSidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Overview", icon: LayoutDashboard, path: "/vendor-dashboard" },
    { name: "Pesan Masuk", icon: MessageSquare, path: "/vendor-dashboard/chat" },
    { name: "Pesanan Masuk", icon: CalendarCheck, path: "/vendor-dashboard/bookings" },
    { name: "Kelola Layanan", icon: Package, path: "/vendor-dashboard/services" },
    { name: "Kelola Kostum", icon: Shirt, path: "/vendor-dashboard/costumes" },
    { name: "Pengaturan", icon: Settings, path: "/vendor-dashboard/settings" },
  ];

  return (
    <div className="w-64 bg-card border-r h-full flex flex-col fixed left-0 top-0 bottom-0 z-40">
      <div className="p-6 border-b flex flex-col gap-2">
        <Link href="/" className="relative flex items-center">
          {/* Light Mode Logo */}
          <div className="dark:hidden">
            <Image src="/images/LOGO.webp" alt="Persona+ Logo" width={120} height={40} className="h-8 w-auto object-contain" />
          </div>
          {/* Dark Mode Logo */}
          <div className="hidden dark:block">
            <Image src="/images/Logo White.webp" alt="Persona+ Logo" width={120} height={40} className="h-8 w-auto object-contain" />
          </div>
        </Link>
        <div className="flex items-center gap-2 mt-4 text-primary">
          <Store className="w-5 h-5" />
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Vendor Panel</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm text-destructive hover:bg-destructive/10 w-full text-left">
          <LogOut className="w-5 h-5" />
          Keluar
        </button>
      </div>
    </div>
  );
}
