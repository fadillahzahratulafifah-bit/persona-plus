"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Save, UploadCloud } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { CldUploadWidget, CldImage } from "next-cloudinary";

export default function CustomerProfilePage() {
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState((user as any)?.image || "");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.id), {
        name: name.trim() || user.name,
        phone: phone.trim(),
        image: avatarUrl,
      });
      setUser({ ...user, name: name.trim() || user.name, image: avatarUrl } as any);
      setSuccessMsg("Profil berhasil diperbarui!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      alert("Gagal menyimpan profil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">Profil Saya</h1>
        <p className="text-muted-foreground">Kelola informasi data diri Anda.</p>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-xl text-center font-medium">
          {successMsg}
        </div>
      )}

      <div className="bg-card border rounded-3xl p-6 shadow-sm">
        <form onSubmit={handleSave}>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="w-32 h-32 rounded-full bg-muted border-4 border-background shadow-sm overflow-hidden relative">
                {avatarUrl ? (
                  <CldImage src={avatarUrl} alt="Foto Profil" fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/10 text-primary">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>
              <CldUploadWidget
                uploadPreset="ml_default"
                onSuccess={(result: any) => setAvatarUrl(result.info.secure_url)}
              >
                {({ open }) => (
                  <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => open()}>
                    <UploadCloud className="w-4 h-4 mr-2" /> Ubah Foto
                  </Button>
                )}
              </CldUploadWidget>
            </div>

            {/* Form Fields */}
            <div className="flex-1 w-full space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder="Masukkan nama" className="w-full pl-10 pr-4 py-2.5 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="email" value={user?.email || ""} disabled
                      className="w-full pl-10 pr-4 py-2.5 border rounded-xl bg-muted text-muted-foreground cursor-not-allowed" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Nomor Telepon / WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="08xxxxxxxxxx" className="w-full pl-10 pr-4 py-2.5 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-muted-foreground">Alamat Utama</label>
                </div>
                <div className="flex gap-3 p-4 border rounded-xl bg-muted/30">
                  <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground italic">Alamat diisi saat proses pemesanan.</p>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" size="lg" disabled={saving} className="rounded-full px-8">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

