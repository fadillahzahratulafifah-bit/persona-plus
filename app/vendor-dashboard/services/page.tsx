"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { DbService, VendorServiceItem } from "@/services/db.service";
import { Button } from "@/components/ui/button";
import { Plus, X, Trash2, UploadCloud } from "lucide-react";
import { CldUploadWidget, CldImage } from "next-cloudinary";

export default function ServicesManagementPage() {
  const user = useAuthStore(state => state.user);
  const [services, setServices] = useState<VendorServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState<'makeup' | 'costume'>('makeup');
  
  // Costume specific fields
  const [anime, setAnime] = useState("");
  const [character, setCharacter] = useState("");
  const [size, setSize] = useState("All Size");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      loadServices();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadServices = async () => {
    if (!user) return;
    const res = await DbService.getVendorServices(user.id);
    if (res.success) {
      setServices(res.data);
    }
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !user) return;
    
    setIsSubmitting(true);
    
    const formattedPrice = price.startsWith("Rp") ? price : `Rp ${parseInt(price.replace(/[^0-9]/g, "") || "0").toLocaleString('id-ID')}`;
    
    const res = await DbService.addService({
      vendorId: user.id,
      vendorName: user.name,
      name,
      description: desc,
      price: formattedPrice,
      imageUrl,
      category,
      ...(category === 'costume' && { anime, character, size })
    });

    if (res.success) {
      await loadServices();
      setIsAdding(false);
      setName("");
      setDesc("");
      setPrice("");
      setImageUrl("");
      setCategory("makeup");
      setAnime("");
      setCharacter("");
      setSize("All Size");
    } else {
      alert("Gagal menambahkan layanan.");
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus layanan ini?")) return;
    const res = await DbService.deleteService(id);
    if (res.success) {
      setServices(prev => prev.filter(s => s.id !== id));
    } else {
      alert("Gagal menghapus layanan.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-2">Kelola Layanan</h1>
          <p className="text-muted-foreground">Tambah, edit, atau hapus layanan yang Anda tawarkan.</p>
        </div>
        <Button className="rounded-full px-6" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? <><X className="w-4 h-4 mr-2" /> Batal</> : <><Plus className="w-4 h-4 mr-2" /> Tambah Layanan</>}
        </Button>
      </div>

      {isAdding && (
        <div className="bg-card border rounded-2xl p-6 shadow-sm mb-6 animate-in slide-in-from-top-4 duration-300">
          <h3 className="font-bold text-lg mb-4">Layanan / Kostum Baru</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama Layanan / Kostum</label>
                <input 
                  type="text" 
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Misal: Makeup Wisuda Premium" required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Harga</label>
                <input 
                  type="text" 
                  value={price} onChange={e => setPrice(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Misal: 500000" required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Kategori</label>
                <select 
                  value={category} onChange={e => setCategory(e.target.value as any)}
                  className="w-full px-4 py-2 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="makeup">Jasa MUA</option>
                  <option value="costume">Sewa Kostum</option>
                </select>
              </div>
            </div>

            {category === 'costume' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-300 bg-muted/50 p-4 rounded-xl border">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Asal Anime / Game</label>
                  <input 
                    type="text" 
                    value={anime} onChange={e => setAnime(e.target.value)}
                    className="w-full px-4 py-2 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="Misal: Genshin Impact" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Karakter</label>
                  <input 
                    type="text" 
                    value={character} onChange={e => setCharacter(e.target.value)}
                    className="w-full px-4 py-2 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="Misal: Hu Tao" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ukuran</label>
                  <select 
                    value={size} onChange={e => setSize(e.target.value)}
                    className="w-full px-4 py-2 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="All Size">All Size</option>
                  </select>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Deskripsi</label>
              <textarea 
                value={desc} onChange={e => setDesc(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none h-24"
                placeholder="Penjelasan layanan Anda..." required
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <CldUploadWidget 
                uploadPreset="ml_default"
                onSuccess={(result: any) => {
                  setImageUrl(result.info.secure_url);
                }}
              >
                {({ open }) => (
                  <Button type="button" variant="secondary" onClick={() => open()} className="mr-auto">
                    <UploadCloud className="w-4 h-4 mr-2" /> 
                    {imageUrl ? "Ganti Foto" : "Unggah Foto"}
                  </Button>
                )}
              </CldUploadWidget>

              <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Batal</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan Layanan"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center">Memuat daftar layanan...</div>
      ) : services.length === 0 ? (
        <div className="py-20 text-center bg-card border rounded-3xl">
          <p className="text-muted-foreground mb-4">Anda belum memiliki layanan.</p>
          <Button onClick={() => setIsAdding(true)} className="rounded-full">Tambah Layanan Pertama</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(svc => (
            <div key={svc.id} className="bg-card border rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col overflow-hidden">
              {svc.imageUrl && (
                <div className="w-full h-40 bg-muted rounded-xl mb-4 overflow-hidden relative">
                  <CldImage src={svc.imageUrl} alt={svc.name} fill className="object-cover" />
                </div>
              )}
              
              <div className="flex justify-between items-start gap-4 mb-2">
                <h3 className="font-bold text-lg">{svc.name}</h3>
                <span className="font-bold text-primary shrink-0">{svc.price}</span>
              </div>
              
              <div className="mb-2">
                <span className="inline-block px-2 py-1 bg-muted text-muted-foreground rounded text-xs font-semibold uppercase">
                  {svc.category === 'makeup' ? 'Jasa MUA' : 'Sewa Kostum'}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                {svc.description}
              </p>
              
              <div className="flex gap-2 mt-auto">
                <Button variant="outline" className="flex-1 rounded-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => handleDelete(svc.id)}>
                  <Trash2 className="w-4 h-4 mr-2" /> Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
