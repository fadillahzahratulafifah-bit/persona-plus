"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, CalendarCheck, Package, Shirt, Settings, LogOut, Store, MessageSquare, Images } from "lucide-react";
import { useAuthStore } from "@/store/auth";

export default function VendorSidebar() {
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
    { name: "Overview", icon: LayoutDashboard, path: "/vendor-dashboard" },
    { name: "Pesan", icon: MessageSquare, path: "/vendor-dashboard/chat" },
    { name: "Pesanan Masuk", icon: CalendarCheck, path: "/vendor-dashboard/bookings" },
    { name: "Kelola Layanan", icon: Package, path: "/vendor-dashboard/services" },
    { name: "Kelola Kostum", icon: Shirt, path: "/vendor-dashboard/costumes" },
    { name: "Portofolio", icon: Images, path: "/vendor-dashboard/portfolio" },
    { name: "Pengaturan", icon: Settings, path: "/vendor-dashboard/settings" },
  ];

  return (
    <div className="w-64 bg-card border-r flex flex-col fixed left-0 top-20 bottom-0 z-40">
      <div className="p-6 border-b flex flex-col gap-2">
        <Link href="/" className="relative flex items-center">
          <div className="dark:hidden">
            <Image src="/images/LOGO.webp" alt="Persona+ Logo" width={120} height={40} className="h-8 w-auto object-contain" />
          </div>
          <div className="hidden dark:block">
            <Image src="/images/Logo White.webp" alt="Persona+ Logo" width={120} height={40} className="h-8 w-auto object-contain" />
          </div>
        </Link>
        <div className="flex items-center gap-2 mt-3 p-3 rounded-xl bg-muted/50">
          <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">
            {(user?.name || 'V')[0].toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user?.name || 'Vendor'}</p>
            <div className="flex items-center gap-1">
              <Store className="w-3 h-3 text-primary" />
              <p className="text-xs text-muted-foreground">Vendor Panel</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
