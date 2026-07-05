// This is a mockup service for Phase 2.
// It simulates fetching data from Firestore.

export interface Costume {
  id: string;
  vendorId: string;
  name: string;
  slug: string;
  character: string;
  anime: string;
  size: string;
  price: string;
  stock: number;
  image: string;
  description: string;
  vendorName?: string; // hydrated field
}

const MOCK_COSTUMES: Costume[] = [
  {
    id: "c1",
    vendorId: "v2",
    name: "Raiden Shogun Cosplay Fullset",
    slug: "raiden-shogun-cosplay",
    character: "Raiden Shogun",
    anime: "Genshin Impact",
    size: "M",
    price: "Rp 150.000",
    stock: 2,
    image: "/assets/11.webp",
    description: "Kostum lengkap Raiden Shogun termasuk aksesoris rambut, baju, obi, dan stocking. Wig disewakan terpisah.",
    vendorName: "Sakura Cosplay"
  },
  {
    id: "c2",
    vendorId: "v2",
    name: "Hatsune Miku Default",
    slug: "hatsune-miku-default",
    character: "Hatsune Miku",
    anime: "Vocaloid",
    size: "L",
    price: "Rp 120.000",
    stock: 1,
    image: "/assets/12.webp",
    description: "Baju Miku lengkap dengan dasi dan aksesoris lengan.",
    vendorName: "Sakura Cosplay"
  },
  {
    id: "c3",
    vendorId: "v2",
    name: "Gojo Satoru Jujutsu High",
    slug: "gojo-satoru-jujutsu",
    character: "Gojo Satoru",
    anime: "Jujutsu Kaisen",
    size: "XL",
    price: "Rp 100.000",
    stock: 3,
    image: "/assets/13.webp",
    description: "Seragam Jujutsu High lengkap dengan kacamata hitam/penutup mata.",
    vendorName: "Sakura Cosplay"
  },
  {
    id: "c4",
    vendorId: "v2",
    name: "Yor Forger Assassin",
    slug: "yor-forger-assassin",
    character: "Yor Forger",
    anime: "Spy x Family",
    size: "S",
    price: "Rp 130.000",
    stock: 1,
    image: "/assets/14.webp",
    description: "Dress hitam Thorn Princess lengkap dengan senjata replika.",
    vendorName: "Sakura Cosplay"
  }
];

export class CostumeService {
  static async getCostumes(query?: string): Promise<{ success: boolean; data: Costume[] }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = MOCK_COSTUMES;
    if (query) {
      const q = query.toLowerCase();
      filtered = MOCK_COSTUMES.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.character.toLowerCase().includes(q) ||
        c.anime.toLowerCase().includes(q)
      );
    }
    
    return { success: true, data: filtered };
  }

  static async getCostumeBySlug(slug: string): Promise<{ success: boolean; data?: Costume; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const costume = MOCK_COSTUMES.find(c => c.slug === slug);
    if (!costume) {
      return { success: false, error: "Costume not found" };
    }
    
    return { success: true, data: costume };
  }
}
