"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DbService } from "@/services/db.service";
import VendorCard from "@/components/cards/VendorCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  "makeup-wisuda": "Makeup Wisuda",
  "makeup-wedding": "Makeup Wedding",
  "makeup-cosplay": "Makeup Cosplay",
  "makeup-kpop": "Makeup K-Pop",
  "makeup-party": "Makeup Party",
  "costume-rental": "Sewa Kostum",
  "hair-styling": "Hair Styling",
  "accessories": "Aksesoris",
};
const CATEGORY_EMOJIS: Record<string, string> = {
  "makeup-wisuda": ".", "makeup-wedding": ".", "makeup-cosplay": ".",
  "makeup-kpop": ".", "makeup-party": ".", "costume-rental": ".",
  "hair-styling": ".", "accessories": ".",
};
export default function ServiceCategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const categoryLabel = CATEGORY_LABELS[slug] || slug;
  useEffect(() => {
    DbService.getVendors().then(res => {
      if (res.success) {
        const filtered = res.data.filter((v: any) => {
          const cat = (v.category || "").toLowerCase();
          return cat.includes(categoryLabel.toLowerCase()) || cat.includes(slug.replace(/-/g, " "));
        });
        setVendors(filtered.length > 0 ? filtered : res.data);
      }
      setLoading(false);
    });
  }, [slug, categoryLabel]);
  return (
    <div className="container mx-auto px-4 md:px-6 pt-24 pb-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
      </Link>
      <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 md:p-12 mb-10 text-center">
        <h1 className="text-4xl font-bold font-heading mb-3">{categoryLabel}</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">Temukan vendor terbaik untuk layanan {categoryLabel} Anda.</p>
      </div>
      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Memuat vendor...</div>
      ) : vendors.length === 0 ? (
        <div className="text-center py-20 bg-card border border-dashed rounded-3xl">
          <p className="font-semibold mb-2">Belum ada vendor untuk kategori ini</p>
          <Link href="/vendors" className="inline-block mt-4 text-primary hover:underline font-bold">Lihat Semua Vendor</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vendors.map((vendor: any) => (
            <VendorCard key={vendor.id} vendor={{
              id: vendor.id, name: vendor.name || "Vendor", slug: vendor.id,
              image: vendor.image || "/assets/KL.Makeup K-Pop.webp",
              rating: vendor.rating || "0", reviewsCount: vendor.reviewsCount || 0,
              location: vendor.location || "Belum diatur", category: vendor.category || "",
              price: vendor.price || "Hubungi Vendor", description: vendor.description || "",
              services: [], portfolios: [],
            }} />
          ))}
        </div>
      )}
    </div>
  );
}