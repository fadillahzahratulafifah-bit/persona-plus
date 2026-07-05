"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlist";
import type { Costume } from "@/services/costume.service";

export default function CostumeCard({ costume }: { costume: Costume }) {
  const { hasItem, addItem, removeItem } = useWishlistStore();
  const isWishlisted = hasItem(costume.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeItem(costume.id);
    } else {
      addItem({
        id: costume.id,
        type: 'costume',
        name: costume.name,
        image: costume.image,
        price: costume.price,
        slug: costume.slug
      });
    }
  };

  return (
    <Link href={`/costumes/${costume.slug}`} className="block">
      <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border h-full flex flex-col">
        <div className="relative h-64 w-full overflow-hidden bg-muted/50">
          <Image 
            src={costume.image} 
            alt={costume.name} 
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <button 
            onClick={toggleWishlist}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full hover:bg-white transition-colors z-10"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
          </button>
          {costume.stock < 2 && (
            <div className="absolute top-3 left-3 bg-destructive/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-white z-10">
              Sisa {costume.stock}
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-base group-hover:text-primary transition-colors line-clamp-2">{costume.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-1">{costume.character} - {costume.anime}</p>
          <div className="flex items-center gap-2 mt-2 mb-4">
            <span className="text-xs font-semibold px-2 py-1 bg-muted rounded-md border text-muted-foreground">Size {costume.size}</span>
            {costume.vendorName && <span className="text-xs text-muted-foreground flex items-center gap-1"><Package className="w-3 h-3"/> {costume.vendorName}</span>}
          </div>
          <div className="flex justify-between items-end pt-4 border-t mt-auto">
            <div>
              <p className="text-xs text-muted-foreground">Harga Sewa / Hari</p>
              <p className="font-bold text-primary">{costume.price}</p>
            </div>
            <Button size="sm" className="rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white">Sewa</Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
