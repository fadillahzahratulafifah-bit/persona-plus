"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ChevronRight, Search, Users, Shield, Award } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (locationQuery.trim()) params.set("loc", locationQuery.trim());
    router.push(`/vendors?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-background pt-16 min-h-[580px] md:min-h-[680px] flex items-center">
        {/* Background Characters */}
        <div className="absolute inset-0 z-0 opacity-30 md:opacity-80 flex justify-center items-end">
          <Image 
            src="/assets/hero-banner.webp" 
            alt="Persona+ Banner" 
            fill 
            className="object-cover object-center pointer-events-none" 
            priority
          />
        </div>
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-background/85 via-background/60 to-background/30 md:from-background/80 md:via-background/50 md:to-background/20" />
        
        <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center md:items-start text-center md:text-left py-16 md:py-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-primary/20">
            <Award className="w-3.5 h-3.5" />
            Platform Makeup & Cosplay #1 di Indonesia
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-foreground mb-4 leading-tight max-w-2xl">
            Temukan <span className="text-primary">Makeup Artist</span> & Sewa Kostum Terbaik
          </h1>
          <p className="text-lg text-foreground/70 mb-8 max-w-xl">
            Ratusan vendor profesional MUA, Hair Stylist, dan penyewa kostum anime/cosplay siap melayani acara spesial Anda.
          </p>

          {/* Search Bar */}
          <div className="bg-white/90 dark:bg-card/90 backdrop-blur-md p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center w-full max-w-2xl mb-8 border border-white/50 gap-2 sm:gap-0">
            <div className="flex-1 flex items-center px-4 sm:border-r border-gray-200 w-full">
              <Search className="h-5 w-5 text-primary mr-2 shrink-0" />
              <input type="text" value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Cari layanan, vendor, atau kostum..." 
                className="w-full bg-transparent border-none focus:outline-none text-foreground py-2 font-medium text-sm" />
            </div>
            <div className="hidden sm:flex flex-1 items-center px-4">
              <MapPin className="h-5 w-5 text-primary mr-2 shrink-0" />
              <input type="text" value={locationQuery}
                onChange={e => setLocationQuery(e.target.value)}
                placeholder="Kota / Lokasi" 
                className="w-full bg-transparent border-none focus:outline-none text-foreground py-2 font-medium text-sm" />
            </div>
            <Button onClick={handleSearch} className="rounded-xl bg-primary hover:bg-primary/90 text-white px-6 shadow-lg shadow-primary/30 w-full sm:w-auto shrink-0">Cari Sekarang</Button>
          </div>
          
          {/* Quick CTA */}
          <div className="flex flex-wrap gap-3">
            <Link href="/vendors">
              <Button size="lg" variant="default" className="rounded-full font-bold shadow-lg shadow-primary/30 px-8">Cari Vendor MUA</Button>
            </Link>
            <Link href="/costumes">
              <Button size="lg" variant="outline" className="rounded-full bg-white/60 dark:bg-card/60 backdrop-blur-sm border-primary/20 text-primary hover:bg-white/80 font-bold px-8 shadow-sm">Sewa Kostum</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((stat, i) => (
              <div key={i}>
                <p className="text-3xl font-bold font-heading mb-1">{stat.value}</p>
                <p className="text-sm text-primary-foreground/80">{stat.label}</p>
              </div>
            ))}
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
              <Link href={`/vendors/${vendor.slug}`} key={i} className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border block">
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
              </Link>
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
            <div className="relative w-full md:w-[400px] h-[300px] rounded-2xl overflow-hidden shadow-lg bg-black/5 flex items-center justify-center p-6 border border-primary/20">
              <Image 
                src="/assets/tagline.webp" 
                alt="Tagline" 
                fill 
                className="object-contain p-2"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const STATS = [
  { value: "500+", label: "Vendor Aktif" },
  { value: "10.000+", label: "Pelanggan Puas" },
  { value: "50.000+", label: "Layanan Selesai" },
  { value: "4.9★", label: "Rating Rata-rata" },
];

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
    slug: "kl-makeup-studio",
    image: "/assets/KL.Makeup Wisuda.webp",
    rating: "4.9",
    location: "Jakarta Selatan",
    category: "Makeup Wisuda & Wedding",
    price: "Rp 350.000"
  },
  {
    name: "Sakura Cosplay",
    slug: "sakura-cosplay",
    image: "/assets/KL.Sewa Kostum.webp",
    rating: "4.8",
    location: "Bandung",
    category: "Sewa Kostum Anime",
    price: "Rp 150.000"
  },
  {
    name: "Disney Dreams",
    slug: "disney-dreams",
    image: "/assets/KLMakeup Disney.webp",
    rating: "5.0",
    location: "Tangerang",
    category: "Makeup Karakter",
    price: "Rp 500.000"
  },
  {
    name: "K-Style Beauty",
    slug: "k-style-beauty",
    image: "/assets/KL.Makeup K-Pop.webp",
    rating: "4.7",
    location: "Jakarta Barat",
    category: "Makeup K-Pop",
    price: "Rp 300.000"
  }
];
