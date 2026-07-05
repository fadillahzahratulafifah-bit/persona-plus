"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlistStore } from "@/store/wishlist";
import { Trash2, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();

  const vendors = items.filter(i => i.type === 'vendor');
  const costumes = items.filter(i => i.type === 'costume');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-2">Wishlist Saya</h1>
          <p className="text-muted-foreground">Kelola vendor dan kostum yang Anda simpan.</p>
        </div>
        
        {items.length > 0 && (
          <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={clearWishlist}>
            <Trash2 className="w-4 h-4 mr-2" /> Hapus Semua
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-32 text-center bg-card rounded-3xl border border-dashed flex flex-col items-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">Wishlist Kosong</h3>
          <p className="text-muted-foreground mb-6">Anda belum menyimpan vendor atau kostum apa pun.</p>
          <div className="flex gap-4">
            <Link href="/vendors"><Button>Cari Vendor</Button></Link>
            <Link href="/costumes"><Button variant="outline">Sewa Kostum</Button></Link>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          
          {vendors.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                Vendor Disimpan <span className="bg-primary/10 text-primary text-sm px-2 py-0.5 rounded-full">{vendors.length}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {vendors.map(vendor => (
                  <div key={vendor.id} className="bg-card border rounded-2xl p-4 flex flex-col group">
                    <div className="flex gap-4 mb-4">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                        <Image src={vendor.image} alt={vendor.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm mb-1 line-clamp-2">{vendor.name}</h4>
                        {vendor.location && <p className="text-xs text-muted-foreground mb-1">{vendor.location}</p>}
                        {vendor.price && <p className="font-bold text-primary text-sm">{vendor.price}</p>}
                      </div>
                    </div>
                    <div className="mt-auto flex gap-2">
                      <Link href={`/vendors/${vendor.slug}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          <ExternalLink className="w-3 h-3 mr-1"/> Detail
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => removeItem(vendor.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {costumes.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                Kostum Disimpan <span className="bg-accent/10 text-accent text-sm px-2 py-0.5 rounded-full">{costumes.length}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {costumes.map(costume => (
                  <div key={costume.id} className="bg-card border rounded-2xl p-4 flex flex-col group">
                    <div className="flex gap-4 mb-4">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-muted">
                        <Image src={costume.image} alt={costume.name} fill className="object-contain" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm mb-1 line-clamp-2">{costume.name}</h4>
                        {costume.price && <p className="font-bold text-primary text-sm">{costume.price}</p>}
                      </div>
                    </div>
                    <div className="mt-auto flex gap-2">
                      <Link href={`/costumes/${costume.slug}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          <ExternalLink className="w-3 h-3 mr-1"/> Detail
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => removeItem(costume.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
