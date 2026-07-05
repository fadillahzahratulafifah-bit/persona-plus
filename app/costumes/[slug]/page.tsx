"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DbService, VendorServiceItem } from "@/services/db.service";
import { MapPin, Package, Heart, Share2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CostumeDetailPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = use(paramsPromise);
  const [costume, setCostume] = useState<VendorServiceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      // In costumes list, slug is the service ID
      const res = await DbService.getServiceById(params.slug);
      if (res.success && res.data && res.data.category === 'costume') {
        setCostume(res.data);
      } else {
        setError(res.error || "Kostum tidak ditemukan atau kategori tidak sesuai");
      }
      setLoading(false);
    }
    loadData();
  }, [params.slug]);

  if (loading) {
    return <div className="container mx-auto px-4 py-32 text-center">Memuat detail kostum...</div>;
  }

  if (!costume) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-bold mb-4">Kostum Tidak Ditemukan</h1>
        <p className="text-muted-foreground">{error || "Kostum yang Anda cari tidak ada atau telah dihapus."}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        
        {/* Image Gallery */}
        <div className="w-full md:w-1/2 lg:w-5/12">
          <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-muted border">
            <Image src={costume.imageUrl || '/assets/KL.Sewa Kostum.webp'} alt={costume.name} fill className="object-contain p-4" />
          </div>
        </div>

        {/* Costume Details */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
              {costume.anime || 'General'}
            </span>
            <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full">
              {costume.character || 'No Character'}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">{costume.name}</h1>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Harga Sewa / Hari</span>
              <span className="text-2xl font-bold text-primary">{costume.price}</span>
            </div>
            <div className="h-10 w-px bg-border mx-2"></div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Tersedia</span>
              <span className="text-xl font-bold font-heading">1 <span className="text-sm font-normal">Pcs</span></span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-2">Ukuran Kostum</h3>
            <div className="flex gap-3">
              <button 
                className={`px-6 py-2 rounded-xl flex items-center justify-center font-bold text-sm border-2 transition-all border-primary bg-primary/5 text-primary`}
              >
                {costume.size || 'All Size'}
              </button>
            </div>
          </div>

          <div className="mb-8 prose prose-sm max-w-none">
            <h3 className="font-bold mb-2 text-base">Deskripsi</h3>
            <p className="text-foreground/80 leading-relaxed">{costume.description}</p>
          </div>

          <div className="p-4 bg-muted rounded-2xl mb-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shrink-0 shadow-sm">
              <Package className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Disewakan oleh</p>
              <p className="font-bold text-sm">{costume.vendorName}</p>
            </div>
            <Link href={`/vendors/${costume.vendorId}`}>
              <Button variant="outline" size="sm" className="rounded-full text-xs">Lihat Vendor</Button>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-auto">
            <Link href={`/booking/${costume.vendorId}?serviceId=${costume.id}`} className="flex-1">
              <Button size="lg" className="w-full rounded-full text-white">Sewa Sekarang</Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-full w-14 p-0 shrink-0">
              <Heart className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full w-14 p-0 shrink-0">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="w-4 h-4 shrink-0 text-primary" />
            <p>Harga sewa belum termasuk deposit dan ongkos kirim. Silakan baca Syarat & Ketentuan sewa dari vendor.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
