import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, User } from "lucide-react";

export const MOCK_BLOGS = [
  {
    slug: "tren-makeup-wedding-2026",
    title: "Tren Makeup Wedding Tahun 2026: Minimalis Tapi Flawless",
    excerpt: "Berbeda dengan tahun-tahun sebelumnya yang menonjolkan bold makeup, tahun ini pengantin lebih memilih tampilan kulit sehat bercahaya.",
    category: "Makeup",
    author: "Tim Persona+",
    date: "12 Agt 2026",
    imageUrl: "bg-pink-100" // using bg color as placeholder for images
  },
  {
    slug: "tips-sewa-kostum-anime",
    title: "5 Hal yang Harus Diperhatikan Sebelum Menyewa Kostum Anime",
    excerpt: "Menyewa kostum untuk event Jejepangan memang menyenangkan, tapi pastikan kamu mengecek kelengkapan dan ukuran dengan teliti.",
    category: "Cosplay",
    author: "Rina Cosplayer",
    date: "05 Agt 2026",
    imageUrl: "bg-blue-100"
  },
  {
    slug: "perawatan-kulit-sebelum-makeup",
    title: "Step Skincare Wajib Sebelum Menggunakan Makeup Tebal",
    excerpt: "Skin prep adalah kunci! Dapatkan hasil makeup awet seharian tanpa crack dengan langkah skincare sederhana ini.",
    category: "Skincare",
    author: "Tim Persona+",
    date: "28 Jul 2026",
    imageUrl: "bg-orange-100"
  }
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 pt-28 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold font-heading mb-4">Artikel & Inspirasi</h1>
          <p className="text-muted-foreground text-lg">Temukan tips makeup, panduan event cosplay, dan cerita menarik dari para vendor kami.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["Semua", "Makeup", "Cosplay", "Skincare", "Event"].map((cat) => (
            <button key={cat} className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${cat === "Semua" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground hover:bg-muted"}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_BLOGS.map((blog) => (
          <Link key={blog.slug} href={`/blog/${blog.slug}`} className="group flex flex-col bg-card border rounded-3xl overflow-hidden hover:border-primary/50 hover:shadow-md transition-all">
            <div className={`h-56 ${blog.imageUrl} relative overflow-hidden`}>
              {/* Image Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/30">
                  {blog.category}
                </span>
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {blog.date}</span>
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {blog.author}</span>
              </div>
              <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors leading-tight">
                {blog.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                {blog.excerpt}
              </p>
              
              <div className="flex items-center text-primary text-sm font-bold mt-auto group-hover:translate-x-1 transition-transform">
                Baca Selengkapnya <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
