"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { DbService, VendorServiceItem } from "@/services/db.service";
import { Button } from "@/components/ui/button";
import { Plus, X, Trash2, Edit, UploadCloud } from "lucide-react";
import { CldUploadWidget, CldImage } from "next-cloudinary";

export default function CostumesManagementPage() {
  const user = useAuthStore(state => state.user);
  const [costumes, setCostumes] = useState<VendorServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [anime, setAnime] = useState("");
  const [character, setCharacter] = useState("");
  const [size, setSize] = useState("All Size");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) loadCostumes();
    else setLoading(false);
  }, [user]);

  const loadCostumes = async () => {
    if (!user) return;
    const res = await DbService.getVendorServices(user.id);
    if (res.success) {
      setCostumes(res.data.filter(s => s.category === 'costume'));
    }
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !user) return;
    setIsSubmitting(true);
    
    const formattedPrice = price.startsWith("Rp") ? price : `Rp ${parseInt(price.replace(/[^0-9]/g, "") || "0").toLocaleString('id-ID')}`;

    const costumeData = {
      vendorId: user.id,
      vendorName: user.name,
      name,
      description: desc,
      price: formattedPrice,
      imageUrl: imageUrl,
      category: 'costume' as const,
      anime,
      character,
      size
    };

    const res = editingId 
      ? await DbService.updateService(editingId, costumeData)
      : await DbService.addService(costumeData);

    if (res.success) {
      await loadCostumes();
      handleCancelEdit();
    } else {
      alert("Gagal menyimpan kostum.");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kostum ini?")) return;
    const res = await DbService.deleteService(id);
    if (res.success) setCostumes(prev => prev.filter(s => s.id !== id));
  };

  const handleEdit = (c: VendorServiceItem) => {
    setEditingId(c.id || null);
    setName(c.name || "");
    setDesc(c.description || "");
    setPrice(c.price || "");
    setImageUrl(c.imageUrl || "");
    setAnime(c.anime || "");
    setCharacter(c.character || "");
    setSize(c.size || "All Size");
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    setName(""); setDesc(""); setPrice(""); setImageUrl("");
    setAnime(""); setCharacter(""); setSize("All Size");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-2">Kelola Kostum</h1>
          <p className="text-muted-foreground">Tambah atau hapus kostum yang tersedia untuk disewa.</p>
        </div>
        <Button className="rounded-full px-6" onClick={isAdding ? handleCancelEdit : () => setIsAdding(true)}>
          {isAdding ? <><X className="w-4 h-4 mr-2" />Batal</> : <><Plus className="w-4 h-4 mr-2" />Tambah Kostum</>}
        </Button>
      </div>

      {isAdding && (
        <div className="bg-card border rounded-2xl p-6 shadow-sm animate-in slide-in-from-top-4 duration-300">
          <h3 className="font-bold text-lg mb-4">{editingId ? "Edit Kostum" : "Kostum Baru"}</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama Kostum</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Misal: Kostum Hu Tao Genshin" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Harga Sewa</label>
                <input type="text" value={price} onChange={e => setPrice(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Misal: 150000" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/50 p-4 rounded-xl border">
              <div className="space-y-2">
                <label className="text-sm font-medium">Asal Anime / Game</label>
                <input type="text" value={anime} onChange={e => setAnime(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Misal: Genshin Impact" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Karakter</label>
                <input type="text" value={character} onChange={e => setCharacter(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Misal: Hu Tao" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ukuran</label>
                <select value={size} onChange={e => setSize(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none">
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="All Size">All Size</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Deskripsi</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none h-24"
                placeholder="Deskripsi kondisi dan detail kostum..." required />
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
              <Button type="button" variant="outline" onClick={handleCancelEdit}>Batal</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Menyimpan..." : "Simpan Kostum"}</Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center">Memuat daftar kostum...</div>
      ) : costumes.length === 0 ? (
        <div className="py-20 text-center bg-card border rounded-3xl">
          <p className="text-muted-foreground mb-4">Anda belum memiliki kostum yang terdaftar.</p>
          <Button onClick={() => setIsAdding(true)} className="rounded-full">Tambah Kostum Pertama</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {costumes.map(c => (
            <div key={c.id} className="bg-card border rounded-2xl p-5 flex flex-col gap-3 overflow-hidden">
              {c.imageUrl && (
                <div className="w-full h-48 bg-muted rounded-xl -mx-5 -mt-5 mb-2 overflow-hidden relative">
                  <CldImage src={c.imageUrl} alt={c.name} fill className="object-cover" />
                </div>
              )}
              <div className="flex justify-between items-start mt-2">
                <h3 className="font-bold text-lg">{c.name}</h3>
                <span className="font-bold text-primary shrink-0">{c.price}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {c.anime && <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">{c.anime}</span>}
                {c.character && <span className="px-2 py-1 bg-accent/10 text-accent rounded text-xs">{c.character}</span>}
                {c.size && <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">{c.size}</span>}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{c.description}</p>
              <div className="flex gap-2 mt-auto">
                <Button variant="outline" size="sm" className="flex-1 rounded-full text-foreground hover:bg-muted" onClick={() => handleEdit(c)}>
                  <Edit className="w-4 h-4 mr-2" />Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 rounded-full border-destructive text-destructive hover:bg-destructive hover:text-white" onClick={() => handleDelete(c.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
