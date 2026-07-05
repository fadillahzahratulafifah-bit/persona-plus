import Link from "next/link";
import Image from "next/image";
import { Search, User, Menu, Heart, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="relative flex items-center">
            {/* Light Mode Logo */}
            <div className="dark:hidden">
              <Image src="/images/LOGO.png" alt="Persona+ Logo" width={120} height={40} className="h-8 w-auto object-contain" />
            </div>
            {/* Dark Mode Logo */}
            <div className="hidden dark:block">
              <Image src="/images/Logo White.png" alt="Persona+ Logo" width={120} height={40} className="h-8 w-auto object-contain" />
            </div>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-primary">Home</Link>
            <Link href="/vendors" className="text-foreground/80 hover:text-primary transition-colors">MUA & Hair Stylist</Link>
            <Link href="/costumes" className="text-foreground/80 hover:text-primary transition-colors">Sewa Kostum</Link>
            <Link href="/promo" className="text-foreground/80 hover:text-primary transition-colors">Promo</Link>
            <Link href="/blog" className="text-foreground/80 hover:text-primary transition-colors">Blog</Link>
            <Link href="/help" className="text-foreground/80 hover:text-primary transition-colors">Bantuan</Link>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <div className="relative mr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search vendor or costume..." 
              className="pl-9 pr-4 py-2 rounded-full bg-muted border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary w-[200px] lg:w-[250px] transition-all"
            />
          </div>
          
          <ThemeToggle />

          <Link href="/dashboard/wishlist">
            <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/dashboard/booking">
            <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary">
              <CalendarClock className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 border-l pl-4 ml-2">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">Register</Button>
            </Link>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </nav>
  );
}
