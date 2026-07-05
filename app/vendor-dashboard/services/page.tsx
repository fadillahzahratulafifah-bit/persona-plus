"use client";

import { useState } from "react";
import { useVendorStore } from "@/store/vendor";
import { Button } from "@/components/ui/button";
import { Plus, X, Trash2, Image as ImageIcon, UploadCloud } from "lucide-react";
import { CldUploadWidget, CldImage } from "next-cloudinary";

export default function ServicesManagementPage() {
  const { services, addService, deleteService } = useVendorStore();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    
    // Auto format price if they just typed numbers
    const formattedPrice = price.startsWith("Rp") ? price : `Rp ${parseInt(price.replace(/[^0-9]/g, "") || "0").toLocaleString('id-ID')}`;
    
    addService({ name, description: desc, price: formattedPrice, imageUrl });
    setIsAdding(false);
    setName("");
    setDesc("");
    setPrice("");
    setImageUrl("");
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
          <h3 className="font-bold text-lg mb-4">Layanan Baru</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama Layanan</label>
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
            </div>
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
                uploadPreset="ml_default" // Use your actual upload preset if you have one, or configure unsigned uploads
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
              <Button type="submit">Simpan Layanan</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(svc => (
          <div key={svc.id} className="bg-card border rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col overflow-hidden">
            {svc.imageUrl ? (
              <div className="w-full h-40 mb-4 rounded-xl overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={svc.imageUrl} alt={svc.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full h-40 mb-4 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                <ImageIcon className="w-8 h-8 opacity-20" />
              </div>
            )}
            <h3 className="font-bold text-lg mb-2">{svc.name}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{svc.description}</p>
            <div className="flex justify-between items-end mt-auto pt-4 border-t border-dashed">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Harga</p>
                <p className="font-bold text-primary">{svc.price}</p>
              </div>
              <div className="space-x-2">
                <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => deleteService(svc.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">Edit</Button>
              </div>
            </div>
          </div>
        ))}
        {services.length === 0 && !isAdding && (
          <div className="col-span-full py-12 text-center border rounded-2xl border-dashed">
            <p className="text-muted-foreground mb-4">Anda belum menambahkan layanan apapun.</p>
            <Button variant="outline" onClick={() => setIsAdding(true)}>Tambah Layanan Pertama</Button>
          </div>
        )}
      </div>
    </div>
  );
}
