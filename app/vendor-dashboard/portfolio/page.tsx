"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { UploadCloud, Trash2, Images } from "lucide-react";

interface PortfolioItem { id: string; imageUrl: string; caption: string; vendorId: string; createdAt: string; }

export default function VendorPortfolioPage() {
  const user = useAuthStore(state => state.user);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [caption, setCaption] = useState("");

  const fetchPortfolio = async () => {
    if (!user) return;
    const q = query(collection(db, "portfolios"), where("vendorId", "==", user.id));
    const snap = await getDocs(q);
    setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as PortfolioItem)));
    setLoading(false);
  };

  useEffect(() => { fetchPortfolio(); }, [user]);

  const handleUploadSuccess = async (imageUrl: string) => {
    if (!user) return;
    await addDoc(collection(db, "portfolios"), {
      vendorId: user.id, imageUrl, caption: caption.trim(), createdAt: new Date().toISOString()
    });
    setCaption("");
    fetchPortfolio();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus foto ini dari portofolio?")) return;
    await deleteDoc(doc(db, "portfolios", id));
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">Portofolio Saya</h1>
        <p className="text-muted-foreground">Tambahkan foto hasil kerja terbaik Anda untuk menarik lebih banyak pelanggan.</p>
      </div>

      <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-lg">Tambah Foto Portofolio</h2>
        <input type="text" value={caption} onChange={e => setCaption(e.target.value)}
          placeholder="Keterangan foto (opsional)..."
          className="w-full px-4 py-2.5 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none text-sm" />
        <CldUploadWidget uploadPreset="ml_default" onSuccess={(result: any) => handleUploadSuccess(result.info.secure_url)}>
          {({ open }) => (
            <Button type="button" onClick={() => open()} className="rounded-full">
              <UploadCloud className="w-4 h-4 mr-2" /> Upload Foto
            </Button>
          )}
        </CldUploadWidget>
      </div>

      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Memuat portofolio...</div>
      ) : items.length === 0 ? (
        <div className="py-24 text-center bg-card rounded-3xl border border-dashed flex flex-col items-center">
          <Images className="w-12 h-12 text-muted-foreground/30 mb-3" />
          <p className="font-semibold mb-1">Belum ada foto portofolio</p>
          <p className="text-sm text-muted-foreground">Upload foto terbaik Anda untuk ditampilkan ke pelanggan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="group relative rounded-2xl overflow-hidden bg-muted aspect-square border">
              <CldImage src={item.imageUrl} alt={item.caption || "Portfolio"} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                  {item.caption}
                </div>
              )}
              <button onClick={() => handleDelete(item.id)}
                className="absolute top-2 right-2 bg-red-500/90 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
