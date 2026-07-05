"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { DbService } from "@/services/db.service";
import { Button } from "@/components/ui/button";
import { Save, UploadCloud } from "lucide-react";
import { CldUploadWidget, CldImage } from "next-cloudinary";

export default function VendorSettingsPage() {
  const user = useAuthStore(state => state.user);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    location: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    if (user) {
      DbService.getVendorById(user.id).then(res => {
        if (res.success && res.data) {
          setFormData({
            name: res.data.name || user.name || "",
            category: res.data.category || "",
            location: res.data.location || "",
            description: res.data.description || "",
            image: res.data.image || "",
          });
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    const res = await DbService.updateVendorProfile(user.id, formData);
    if (res.success) {
      alert("Pengaturan profil berhasil disimpan!");
    } else {
      alert("Gagal menyimpan pengaturan.");
    }
    
    setIsSubmitting(false);
  };

  if (loading) return <div className="p-20 text-center">Memuat pengaturan...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">Pengaturan Vendor</h1>
        <p className="text-muted-foreground">Perbarui informasi toko dan profil bisnis Anda.</p>
      </div>

      <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="shrink-0 flex flex-col gap-3">
              <label className="text-sm font-medium">Foto Profil Bisnis</label>
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-muted border flex items-center justify-center relative">
                {formData.image ? (
                  <CldImage src={formData.image} alt="Profile" fill className="object-cover" />
                ) : (
                  <span className="text-muted-foreground text-xs text-center p-2">Belum ada foto</span>
                )}
              </div>
              <CldUploadWidget 
                uploadPreset="ml_default"
                onSuccess={(result: any) => {
                  setFormData(prev => ({ ...prev, image: result.info.secure_url }));
                }}
              >
                {({ open }) => (
                  <Button type="button" variant="outline" size="sm" onClick={() => open()} className="w-full">
                    <UploadCloud className="w-4 h-4 mr-2" /> Unggah
                  </Button>
                )}
              </CldUploadWidget>
            </div>
            
            <div className="flex-1 space-y-2 w-full">
              <label className="text-sm font-medium">Nama Bisnis / Toko</label>
              <input 
                type="text" 
                name="name"
                value={formData.name} 
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Contoh: KL Makeup Studio" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Kategori Bisnis Utama</label>
              <select 
                name="category"
                value={formData.category} 
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="">-- Pilih Kategori --</option>
                <option value="Makeup Wisuda">Makeup Wisuda</option>
                <option value="Makeup Wedding">Makeup Wedding</option>
                <option value="Makeup Karakter">Makeup Karakter</option>
                <option value="Sewa Kostum Anime">Sewa Kostum Anime</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Lokasi / Kota</label>
              <input 
                type="text" 
                name="location"
                value={formData.location} 
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Contoh: Jakarta Selatan" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Deskripsi / Bio</label>
            <textarea 
              name="description"
              value={formData.description} 
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none h-32"
              placeholder="Ceritakan tentang layanan yang Anda tawarkan..." 
            />
          </div>

          <div className="pt-4 border-t">
            <Button type="submit" disabled={isSubmitting} size="lg" className="w-full md:w-auto px-8 rounded-full">
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
