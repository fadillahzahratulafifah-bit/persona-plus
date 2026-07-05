import Link from "next/link";
import Image from "next/image";
import { Camera, MessageCircle, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card pt-16 pb-8 border-t">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block relative">
              {/* Light Mode Logo */}
              <div className="dark:hidden">
                <Image src="/images/LOGO.webp" alt="Persona+ Logo" width={120} height={40} className="h-8 w-auto object-contain" />
              </div>
              {/* Dark Mode Logo */}
              <div className="hidden dark:block">
                <Image src="/images/Logo White.webp" alt="Persona+ Logo" width={120} height={40} className="h-8 w-auto object-contain" />
              </div>
            </Link>
            <p className="text-muted-foreground text-sm mb-6">
              Platform marketplace berbasis web yang menghubungkan pelanggan dengan penyedia jasa Makeup Artist, Cosplayer, Hair Stylist, serta penyedia penyewaan kostum.
            </p>
            <div className="flex items-center gap-4 text-foreground/60">
              <Link href="#" className="hover:text-primary transition-colors"><Camera className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-primary transition-colors"><MessageCircle className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-primary transition-colors"><Share2 className="h-5 w-5" /></Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/services/makeup-wisuda" className="hover:text-primary transition-colors">Makeup Wisuda</Link></li>
              <li><Link href="/services/makeup-wedding" className="hover:text-primary transition-colors">Makeup Wedding</Link></li>
              <li><Link href="/services/makeup-cosplay" className="hover:text-primary transition-colors">Makeup Cosplay</Link></li>
              <li><Link href="/services/costume-rental" className="hover:text-primary transition-colors">Costume Rental</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Persona+. All rights reserved. "Be AnyOne, Be Yourself, Be Persona"</p>
        </div>
      </div>
    </footer>
  );
}
