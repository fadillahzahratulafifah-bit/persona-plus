"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlist";
import type { Vendor } from "@/services/vendor.service";

export default function VendorCard({ vendor }: { vendor: Vendor }) {
  const { hasItem, addItem, removeItem } = useWishlistStore();
  const isWishlisted = hasItem(vendor.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeItem(vendor.id);
    } else {
      addItem({
        id: vendor.id,
        type: 'vendor',
        name: vendor.name,
        image: vendor.image,
        price: vendor.price,
        rating: vendor.rating,
        location: vendor.location,
        slug: vendor.slug
      });
    }
  };

  return (
    <Link href={`/vendors/${vendor.slug}`} className="block">
      <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border h-full flex flex-col">
        <div className="relative h-48 w-full overflow-hidden">
          <Image 
            src={vendor.image} 
            alt={vendor.name} 
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-foreground">
            <Star className="w-3 h-3 fill-warning text-warning" /> {vendor.rating}
          </div>
          <button 
            onClick={toggleWishlist}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full hover:bg-white transition-colors"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
          </button>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <MapPin className="w-3 h-3" /> {vendor.location}
          </div>
          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{vendor.name}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{vendor.category}</p>
          <div className="flex justify-between items-end pt-4 border-t mt-auto">
            <div>
              <p className="text-xs text-muted-foreground">Mulai dari</p>
              <p className="font-bold text-primary">{vendor.price}</p>
            </div>
            <Button size="sm" variant="outline" className="rounded-full">Lihat</Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
