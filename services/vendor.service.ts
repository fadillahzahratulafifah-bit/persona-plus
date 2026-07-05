// This is a mockup service for Phase 2.
// It simulates fetching data from Firestore.

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  image: string;
  coverImage?: string;
  rating: string;
  reviewsCount: number;
  location: string;
  category: string;
  price: string;
  description: string;
  services: VendorService[];
  portfolios: Portfolio[];
}

export interface VendorService {
  id: string;
  name: string;
  price: string;
  description: string;
}

export interface Portfolio {
  id: string;
  image: string;
  title: string;
}

const MOCK_VENDORS: Vendor[] = [
  {
    id: "v1",
    name: "KL Makeup Studio",
    slug: "kl-makeup-studio",
    image: "/assets/KL.Makeup Wisuda.webp",
    coverImage: "/assets/backround.webp",
    rating: "4.9",
    reviewsCount: 124,
    location: "Jakarta Selatan",
    category: "Makeup Wisuda & Wedding",
    price: "Rp 350.000",
    description: "KL Makeup Studio menyediakan jasa makeup profesional untuk berbagai acara, mulai dari wisuda hingga pernikahan. Kami menggunakan produk berkualitas tinggi untuk memastikan tampilan Anda sempurna sepanjang hari.",
    services: [
      { id: "s1", name: "Makeup Wisuda", price: "Rp 350.000", description: "Makeup tahan lama dengan hasil flawless." },
      { id: "s2", name: "Makeup Wedding", price: "Rp 1.500.000", description: "Paket lengkap untuk pengantin." }
    ],
    portfolios: [
      { id: "p1", image: "/assets/KL.Makeup Wisuda.webp", title: "Wisuda Look" },
      { id: "p2", image: "/assets/Detail Vendor.webp", title: "Wedding Look" }
    ]
  },
  {
    id: "v2",
    name: "Sakura Cosplay",
    slug: "sakura-cosplay",
    image: "/assets/KL.Sewa Kostum.webp",
    coverImage: "/assets/Spanduk Usaha Laundry Ilustratif Ceria Biru.webp",
    rating: "4.8",
    reviewsCount: 89,
    location: "Bandung",
    category: "Sewa Kostum Anime",
    price: "Rp 150.000",
    description: "Menyewakan berbagai macam kostum anime, game, dan film populer dengan kualitas terbaik dan harga terjangkau.",
    services: [
      { id: "s3", name: "Sewa Kostum Harian", price: "Rp 150.000", description: "Sewa kostum untuk 24 jam." }
    ],
    portfolios: [
      { id: "p3", image: "/assets/KL.Sewa Kostum.webp", title: "Genshin Impact" }
    ]
  },
  {
    id: "v3",
    name: "Disney Dreams",
    slug: "disney-dreams",
    image: "/assets/KLMakeup Disney.webp",
    coverImage: "/assets/Spanduk Usaha Laundry Ilustratif Ceria Biru (1).webp",
    rating: "5.0",
    reviewsCount: 42,
    location: "Tangerang",
    category: "Makeup Karakter",
    price: "Rp 500.000",
    description: "Spesialis makeup karakter Disney dan fairy tale. Kami mengubah Anda menjadi karakter favorit Anda.",
    services: [
      { id: "s4", name: "Disney Princess Makeup", price: "Rp 500.000", description: "Full face karakter." }
    ],
    portfolios: [
      { id: "p4", image: "/assets/KLMakeup Disney.webp", title: "Cinderella" }
    ]
  },
  {
    id: "v4",
    name: "K-Style Beauty",
    slug: "k-style-beauty",
    image: "/assets/KL.Makeup K-Pop.webp",
    coverImage: "/assets/Spanduk Usaha Laundry Ilustratif Ceria Biru (2).webp",
    rating: "4.7",
    reviewsCount: 156,
    location: "Jakarta Barat",
    category: "Makeup K-Pop",
    price: "Rp 300.000",
    description: "Ingin tampil seperti idol K-Pop? K-Style Beauty adalah ahlinya! Kami melayani makeup look ala Korea yang natural namun memukau.",
    services: [
      { id: "s5", name: "Idol Look", price: "Rp 300.000", description: "Makeup ala K-Pop Idol." }
    ],
    portfolios: [
      { id: "p5", image: "/assets/KL.Makeup K-Pop.webp", title: "K-Pop Stage Look" }
    ]
  }
];

export class VendorService {
  static async getVendors(query?: string): Promise<{ success: boolean; data: Vendor[] }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = MOCK_VENDORS;
    if (query) {
      const q = query.toLowerCase();
      filtered = MOCK_VENDORS.filter(v => 
        v.name.toLowerCase().includes(q) || 
        v.category.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q)
      );
    }
    
    return { success: true, data: filtered };
  }

  static async getVendorBySlug(slug: string): Promise<{ success: boolean; data?: Vendor; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const vendor = MOCK_VENDORS.find(v => v.slug === slug);
    if (!vendor) {
      return { success: false, error: "Vendor not found" };
    }
    
    return { success: true, data: vendor };
  }
}
