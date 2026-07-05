"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore, UserRole } from "@/store/auth";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const register = useAuthStore(state => state.register);
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }
    
    setLoading(true);
    setError("");

    setTimeout(() => {
      const user = register(name, email, password, role);
      if (user) {
        if (user.role === 'vendor') router.push('/vendor-dashboard');
        else router.push('/dashboard');
      } else {
        setError("Email sudah terdaftar. Gunakan email lain.");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 pt-10">
      <div className="w-full max-w-md bg-card border rounded-3xl p-8 shadow-sm animate-in fade-in zoom-in duration-500">
        
        <div className="flex justify-center mb-8">
          <Link href="/">
            <div className="dark:hidden">
              <Image src="/images/LOGO.webp" alt="Persona+" width={180} height={60} className="h-16 w-auto" />
            </div>
            <div className="hidden dark:block">
              <Image src="/images/Logo White.webp" alt="Persona+" width={180} height={60} className="h-16 w-auto" />
            </div>
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">Buat Akun Baru</h1>
        <p className="text-muted-foreground text-center mb-6 text-sm">Bergabunglah dengan komunitas kecantikan dan cosplay Persona+.</p>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Daftar Sebagai</label>
            <div className="flex gap-4">
              <label className={`flex-1 border rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all ${role === 'customer' ? 'border-primary bg-primary/5 text-primary' : 'bg-background hover:bg-muted'}`}>
                <input type="radio" name="role" value="customer" checked={role === 'customer'} onChange={() => setRole('customer')} className="hidden" />
                <span className="font-bold text-sm">Pelanggan</span>
              </label>
              <label className={`flex-1 border rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all ${role === 'vendor' ? 'border-accent bg-accent/5 text-accent' : 'bg-background hover:bg-muted'}`}>
                <input type="radio" name="role" value="vendor" checked={role === 'vendor'} onChange={() => setRole('vendor')} className="hidden" />
                <span className="font-bold text-sm">Vendor (Jasa)</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nama Lengkap / Bisnis</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Anda" 
              className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com" 
              className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter" 
              className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={loading} className="w-full py-6 rounded-full text-md font-bold">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Daftar Sekarang"}
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Sudah punya akun? <Link href="/login" className="text-primary font-bold hover:underline">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}
