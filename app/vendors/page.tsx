"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DbService } from "@/services/db.service";
import VendorCard from "@/components/cards/VendorCard";
import { Search, MapPin, Filter } from "lucide-react";

export default function VendorsPage() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQ);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync query when URL param changes
  useEffect(() => { setQuery(searchParams.get("q") || ""); }, [searchParams]);

  useEffect(() => {
    DbService.getVendors().then(res => {
      if (res.success) setVendors(res.data);
      setLoading(false);
    });
  }, []);

  const filteredVendors = vendors.filter(v => 
    v.name?.toLowerCase().includes(query.toLowerCase()) || 
    v.category?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 md:px-6 pt-28 pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground mb-2">Cari Vendor</h1>
          <p className="text-muted-foreground">Temukan MUA dan Hair Stylist terbaik untuk acara spesial Anda.</p>
        </div>
        
        {/* Simple Search Bar */}
        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="relative flex-1 md:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Cari nama atau kategori..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <button className="p-2 border rounded-lg bg-card text-foreground hover:bg-muted transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="bg-card p-5 rounded-2xl border shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2"><MapPin className="w-4 h-4"/> Lokasi</h3>
            <div className="space-y-2">
              {['Jakarta Selatan', 'Jakarta Barat', 'Bandung', 'Tangerang'].map((loc) => (
                <label key={loc} className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                  {loc}
                </label>
              ))}
            </div>
          </div>
          
          <div className="bg-card p-5 rounded-2xl border shadow-sm">
            <h3 className="font-bold mb-4">Kategori</h3>
            <div className="space-y-2">
              {['Makeup Wisuda', 'Makeup Wedding', 'Makeup Karakter', 'Makeup K-Pop'].map((cat) => (
                <label key={cat} className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                  {cat}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Vendor Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
              <p className="text-muted-foreground">Memuat daftar vendor...</p>
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
              <p className="text-muted-foreground mb-4">Belum ada vendor yang tersedia.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map(vendor => (
                <VendorCard key={vendor.id} vendor={{
                  id: vendor.id,
                  name: vendor.name || 'Vendor Tanpa Nama',
                  slug: vendor.id,
                  image: vendor.image || '/assets/KL.Makeup K-Pop.webp',
                  rating: vendor.rating || '0',
                  reviewsCount: vendor.reviewsCount || 0,
                  location: vendor.location || 'Lokasi belum diatur',
                  category: vendor.category || 'Belum ada kategori',
                  price: vendor.price || 'Hubungi Vendor',
                  description: vendor.description || '',
                  services: [],
                  portfolios: []
                }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
