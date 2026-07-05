"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { DbService, VendorServiceItem } from "@/services/db.service";
import { ChatService } from "@/services/chat.service";
import { Star, MapPin, CheckCircle, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CldImage } from "next-cloudinary";

export default function VendorDetailPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  
  const [vendor, setVendor] = useState<any>(null);
  const [services, setServices] = useState<VendorServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingChat, setCreatingChat] = useState(false);

  useEffect(() => {
    async function loadData() {
      const res = await DbService.getVendorById(params.slug);
      if (res.success && res.data) {
        setVendor(res.data);
        const svcRes = await DbService.getVendorServices(params.slug);
        if (svcRes.success) {
          setServices(svcRes.data);
        }
      } else {
        setError(res.error || "Vendor tidak ditemukan");
      }
      setLoading(false);
    }
    loadData();
  }, [params.slug]);

  const handleChatVendor = async () => {
    if (!user) {
      alert("Harap login terlebih dahulu untuk memulai chat.");
      router.push("/login");
      return;
    }
    
    setCreatingChat(true);
    try {
      // 1. Get or create room
      const roomRes = await ChatService.getOrCreateChat(user.id, user.name, vendor.id, vendor.name);
      
      if (!roomRes.success || !roomRes.chatId) {
        throw new Error(roomRes.error || "Failed to create chat room");
      }

      // 2. Send an initial hidden message or just create room
      await ChatService.sendMessage(
        roomRes.chatId, 
        user.id, 
        user.name, 
        "Halo, saya ingin bertanya tentang layanan Anda.", 
        vendor.id
      );
      router.push('/dashboard/chat');
    } catch (err) {
      console.error(err);
      alert("Gagal memulai chat.");
      setCreatingChat(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-32 text-center">Memuat data vendor...</div>;
  }

  if (!vendor) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-bold mb-4">Vendor Tidak Ditemukan</h1>
        <p className="text-muted-foreground">{error || "Vendor yang Anda cari tidak ada atau telah dihapus."}</p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Cover Image */}
      <div className="relative h-[300px] md:h-[400px] w-full bg-gradient-to-br from-primary/20 via-muted to-accent/10">
        {vendor.coverImage && (
          <Image src={vendor.coverImage} alt="Cover" fill className="object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Main Info */}
          <div className="flex-1 bg-card p-6 md:p-8 rounded-3xl shadow-sm border">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-background bg-muted relative shrink-0 shadow-md">
                {vendor.image ? (
                  <Image src={vendor.image} alt={vendor.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary">{(vendor.name || 'V')[0].toUpperCase()}</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold font-heading">{vendor.name || 'Vendor Tanpa Nama'}</h1>
                  <CheckCircle className="w-5 h-5 text-success fill-success/20" />
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning fill-warning" /> {vendor.rating || 0} ({vendor.reviewsCount || 0} Reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {vendor.location || 'Lokasi belum diatur'}
                  </span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                    {vendor.category || 'Vendor'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Share2 className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              <h3 className="text-lg font-bold mb-2">Tentang Vendor</h3>
              <p className="text-foreground/80">{vendor.description || 'Belum ada deskripsi.'}</p>
            </div>
            
            {/* Services */}
            <h3 className="text-lg font-bold mb-4">Layanan</h3>
            <div className="space-y-4">
              {services.length === 0 ? (
                <p className="text-muted-foreground">Belum ada layanan yang ditambahkan oleh vendor ini.</p>
              ) : (
                services.map(service => (
                  <div key={service.id} className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/50 transition-colors">
                    <div className="flex gap-4 items-center">
                      {service.imageUrl && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative bg-muted">
                          <CldImage src={service.imageUrl} alt={service.name} fill className="object-cover" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-foreground">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                      <span className="font-bold text-primary">{service.price}</span>
                      <Link href={`/booking/${vendor.id}?serviceId=${service.id}`}>
                        <Button size="sm" className="rounded-full px-6">Pilih</Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-80 space-y-6">
            <div className="bg-card p-6 rounded-3xl border shadow-sm sticky top-24">
              <h3 className="font-bold mb-4">Informasi Booking</h3>
              <Link href={`/booking/${vendor.id}`}>
                <Button className="w-full rounded-full mb-3" size="lg">Booking Sekarang</Button>
              </Link>
              <Button 
                onClick={handleChatVendor}
                disabled={creatingChat}
                className="w-full rounded-full" 
                size="lg" 
                variant="outline"
              >
                {creatingChat ? "Membuka Chat..." : "Chat Vendor"}
              </Button>
            </div>
          </div>
          
        </div>
        
        {/* Portfolio Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold font-heading mb-6">Portofolio</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(vendor.portfolios || []).map((port: any) => (
              <div key={port.id} className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer border">
                <Image src={port.image} alt={port.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white font-medium text-sm">{port.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
