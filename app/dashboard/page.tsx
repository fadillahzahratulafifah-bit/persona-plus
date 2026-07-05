"use client";

import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/auth";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function CustomerProfilePage() {
  const user = useAuthStore(state => state.user);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">Profil Saya</h1>
        <p className="text-muted-foreground">Kelola informasi data diri dan alamat Anda.</p>
      </div>

      <div className="bg-card border rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full bg-muted border-4 border-background shadow-sm overflow-hidden relative">
              {/* Dummy Avatar */}
              <div className="absolute inset-0 flex items-center justify-center bg-primary/10 text-primary">
                <User className="w-12 h-12" />
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-full">Ubah Foto</Button>
          </div>

          <div className="flex-1 w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" defaultValue={user?.name || ""} placeholder="Masukkan nama" className="w-full pl-10 pr-4 py-2 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" defaultValue={user?.email || ""} disabled className="w-full pl-10 pr-4 py-2 border rounded-xl bg-muted text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Nomor Telepon</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="tel" defaultValue="" placeholder="Belum diatur" className="w-full pl-10 pr-4 py-2 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-muted-foreground">Alamat Utama</label>
                <Button variant="ghost" size="sm" className="h-8 text-primary">Ubah Alamat</Button>
              </div>
              <div className="flex gap-3 p-4 border rounded-xl bg-muted/30">
                <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm mb-1">Rumah</p>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    Belum ada alamat yang ditambahkan.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button size="lg" className="rounded-full px-8">Simpan Perubahan</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
