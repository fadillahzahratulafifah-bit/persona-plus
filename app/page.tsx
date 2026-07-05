import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ChevronRight, Search } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent pt-20 pb-32">
        <div className="absolute inset-0 bg-black/10 z-0" />
        <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-heading mb-6 max-w-4xl tracking-tight">
            Be AnyOne, Be Yourself, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Be Persona</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl font-light">
            Platform marketplace terlengkap untuk Makeup Artist, Cosplayer, dan penyewaan kostum di Indonesia. Wujudkan imajinasimu sekarang.
          </p>
          
          <div className="bg-white p-2 rounded-full shadow-lg flex items-center w-full max-w-2xl mb-8">
            <div className="flex-1 flex items-center px-4 border-r">
              <Search className="h-5 w-5 text-muted-foreground mr-2" />
              <input type="text" placeholder="Cari layanan, vendor, atau kostum..." className="w-full bg-transparent border-none focus:outline-none text-foreground py-2" />
            </div>
            <div className="hidden md:flex flex-1 items-center px-4 border-r">
              <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
              <input type="text" placeholder="Lokasi" className="w-full bg-transparent border-none focus:outline-none text-foreground py-2" />
            </div>
            <Button className="rounded-full bg-primary hover:bg-primary/90 text-white px-8">Cari</Button>
          </div>
          
          <div className="flex gap-4">
            <Button size="lg" variant="secondary" className="rounded-full font-semibold">
              Cari Vendor
            </Button>
            <Button size="lg" variant="outline" className="rounded-full bg-transparent text-white border-white hover:bg-white/20 font-semibold">
              Jelajahi Layanan
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold font-heading text-foreground mb-2">Kategori Layanan</h2>
              <p className="text-muted-foreground">Temukan layanan yang sesuai dengan kebutuhan Anda</p>
            </div>
            <Link href="/services" className="hidden md:flex items-center text-primary font-medium hover:underline">
              Lihat Semua <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {CATEGORIES.map((cat, i) => (
              <Link href={`/services/${cat.slug}`} key={i} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-muted hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">{cat.icon}</span>
                </div>
                <h3 className="font-medium text-sm text-center group-hover:text-primary transition-colors">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Vendors */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold font-heading text-foreground mb-2">Vendor Terpopuler</h2>
              <p className="text-muted-foreground">Vendor dengan rating tertinggi pilihan pelanggan</p>
            </div>
            <Link href="/vendors" className="hidden md:flex items-center text-primary font-medium hover:underline">
              Lihat Semua <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VENDORS.map((vendor, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image 
                    src={vendor.image} 
                    alt={vendor.name} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-foreground">
                    <Star className="w-3 h-3 fill-warning text-warning" /> {vendor.rating}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3" /> {vendor.location}
                  </div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{vendor.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{vendor.category}</p>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Mulai dari</p>
                      <p className="font-bold text-primary">{vendor.price}</p>
                    </div>
                    <Button size="sm" variant="outline" className="rounded-full">Lihat</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo / Banner CTA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">Ingin bergabung sebagai Vendor?</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Raih lebih banyak pelanggan dengan membuka layanan Anda di Persona+. Pendaftaran gratis dan mudah!
              </p>
              <Button size="lg" className="rounded-full text-white bg-primary hover:bg-primary/90">
                Daftar Sebagai Vendor
              </Button>
            </div>
            <div className="relative w-full md:w-[400px] h-[300px] rounded-2xl overflow-hidden shadow-lg">
              {/* Fallback image if asset not found */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const CATEGORIES = [
  { name: "Wisuda", slug: "makeup-wisuda", icon: "🎓" },
  { name: "Wedding", slug: "makeup-wedding", icon: "💍" },
  { name: "Cosplay", slug: "makeup-cosplay", icon: "⚔️" },
  { name: "Party", slug: "makeup-party", icon: "🎉" },
  { name: "K-Pop", slug: "makeup-kpop", icon: "✨" },
  { name: "Costume", slug: "costume-rental", icon: "👘" },
  { name: "Hair Style", slug: "hair-styling", icon: "💇‍♀️" },
  { name: "Accessories", slug: "accessories", icon: "👑" },
];

const VENDORS = [
  {
    name: "KL Makeup Studio",
    image: "/assets/KL.Makeup Wisuda.webp",
    rating: "4.9",
    location: "Jakarta Selatan",
    category: "Makeup Wisuda & Wedding",
    price: "Rp 350.000"
  },
  {
    name: "Sakura Cosplay",
    image: "/assets/KL.Sewa Kostum.webp",
    rating: "4.8",
    location: "Bandung",
    category: "Sewa Kostum Anime",
    price: "Rp 150.000"
  },
  {
    name: "Disney Dreams",
    image: "/assets/KLMakeup Disney.webp",
    rating: "5.0",
    location: "Tangerang",
    category: "Makeup Karakter",
    price: "Rp 500.000"
  },
  {
    name: "K-Style Beauty",
    image: "/assets/KL.Makeup K-Pop.webp",
    rating: "4.7",
    location: "Jakarta Barat",
    category: "Makeup K-Pop",
    price: "Rp 300.000"
  }
];
