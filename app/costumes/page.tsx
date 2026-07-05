"use client";

import { useEffect, useState } from "react";
import { DbService, VendorServiceItem } from "@/services/db.service";
import CostumeCard from "@/components/cards/CostumeCard";
import { Search, Filter } from "lucide-react";

export default function CostumesPage() {
  const [query, setQuery] = useState("");
  const [costumes, setCostumes] = useState<VendorServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DbService.getServicesByCategory('costume').then(res => {
      if (res.success) {
        setCostumes(res.data);
      }
      setLoading(false);
    });
  }, []);

  const filteredCostumes = costumes.filter(c => 
    c.name?.toLowerCase().includes(query.toLowerCase()) || 
    c.description?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 md:px-6 pt-28 pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground mb-2">Sewa Kostum</h1>
          <p className="text-muted-foreground">Eksplorasi ribuan kostum cosplay untuk acara event Anda.</p>
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="relative flex-1 md:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Cari karakter atau anime..." 
              value={query}
              onChange={e => setQuery(e.target.value)}
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
            <h3 className="font-bold mb-4">Anime / Game</h3>
            <div className="space-y-2">
              {['Genshin Impact', 'Jujutsu Kaisen', 'Spy x Family', 'Vocaloid'].map((anime) => (
                <label key={anime} className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                  {anime}
                </label>
              ))}
            </div>
          </div>
          
          <div className="bg-card p-5 rounded-2xl border shadow-sm">
            <h3 className="font-bold mb-4">Ukuran</h3>
            <div className="flex flex-wrap gap-2">
              {['S', 'M', 'L', 'XL', 'All Size'].map((size) => (
                <button key={size} className="px-3 py-1 text-xs border rounded-md hover:border-primary hover:text-primary transition-colors">
                  {size}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Costume Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
              <p className="text-muted-foreground">Memuat daftar kostum...</p>
            </div>
          ) : filteredCostumes.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
              <p className="text-muted-foreground">Belum ada kostum yang tersedia saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Note: In a real app we'd map CostumeServiceItem to the expected Costume interface for CostumeCard, or adapt CostumeCard */}
              {filteredCostumes.map(costume => (
                <CostumeCard key={costume.id} costume={{
                  id: costume.id,
                  vendorId: costume.vendorId,
                  vendorName: costume.vendorName,
                  name: costume.name,
                  slug: costume.id,
                  character: "",
                  anime: "",
                  size: "All Size",
                  price: costume.price,
                  stock: 1,
                  image: costume.imageUrl || '/assets/KL.Sewa Kostum.webp',
                  description: costume.description
                }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
