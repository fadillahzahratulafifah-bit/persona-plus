"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Search, Menu, Heart, CalendarClock, X, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuthStore } from "@/store/auth";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore(state => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchValue.trim()) {
      router.push(`/vendors?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue("");
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/vendors", label: "MUA & Hair Stylist" },
    { href: "/costumes", label: "Sewa Kostum" },
    { href: "/promo", label: "Promo" },
    { href: "/blog", label: "Blog" },
    { href: "/help", label: "Bantuan" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="relative flex items-center">
            <div className="dark:hidden">
              <Image src="/images/LOGO.webp" alt="Persona+ Logo" width={200} height={60} className="h-12 w-auto object-contain" />
            </div>
            <div className="hidden dark:block">
              <Image src="/images/Logo White.webp" alt="Persona+ Logo" width={200} height={60} className="h-12 w-auto object-contain" />
            </div>
          </Link>
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-5 text-sm font-medium">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={`transition-colors ${pathname === link.href ? "text-primary font-semibold" : "text-foreground/70 hover:text-primary"}`}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-2">
          <div className="relative mr-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Cari vendor atau kostum..."
              className="pl-9 pr-4 py-2 rounded-full bg-muted border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary w-[200px] lg:w-[240px] transition-all"
            />
          </div>
          <ThemeToggle />
          <Link href="/dashboard/wishlist">
            <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary"><Heart className="h-5 w-5" /></Button>
          </Link>
          <Link href="/dashboard/booking">
            <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary"><CalendarClock className="h-5 w-5" /></Button>
          </Link>
          <div className="border-l pl-3 ml-1">
            {user ? (
              <Link href={user.role === 'vendor' ? '/vendor-dashboard' : '/dashboard'}>
                <Button variant="outline" className="rounded-full gap-2">
                  <User className="w-4 h-4" />{user.name.split(' ')[0]}
                </Button>
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link href="/login"><Button variant="ghost">Login</Button></Link>
                <Link href="/register"><Button className="rounded-full bg-primary hover:bg-primary/90">Register</Button></Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Right */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {menuOpen && (
        <div ref={menuRef} className="md:hidden bg-background/95 backdrop-blur-md border-b shadow-xl animate-in slide-in-from-top-2 duration-200">
          {/* Mobile Search */}
          <div className="px-4 pt-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Cari vendor atau kostum..."
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-muted border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          {/* Nav links */}
          <nav className="px-3 pb-2 space-y-0.5">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  pathname === link.href ? "bg-primary/10 text-primary font-semibold" : "text-foreground/80 hover:bg-muted"
                }`}>
                {link.label}
                <ChevronRight className="w-4 h-4 opacity-40" />
              </Link>
            ))}
          </nav>
          {/* Mobile Auth */}
          <div className="px-4 py-4 border-t bg-muted/20">
            {user ? (
              <Link href={user.role === 'vendor' ? '/vendor-dashboard' : '/dashboard'}>
                <Button className="w-full rounded-full" variant="outline">
                  <User className="w-4 h-4 mr-2" />{user.name} — Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex gap-3">
                <Link href="/login" className="flex-1"><Button variant="outline" className="w-full rounded-full">Login</Button></Link>
                <Link href="/register" className="flex-1"><Button className="w-full rounded-full">Register</Button></Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
