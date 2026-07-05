"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(state => state.login);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    setTimeout(() => {
      const user = login(email, password);
      if (user) {
        if (user.role === 'vendor') router.push('/vendor-dashboard');
        else router.push('/dashboard');
      } else {
        setError("Email atau password salah.");
        setLoading(false);
      }
    }, 1000); // Simulate network request
  };

  const autofill = (type: 'customer' | 'vendor') => {
    setEmail(type === 'customer' ? 'customer@demo.com' : 'vendor@demo.com');
    setPassword('password123');
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

        <h1 className="text-2xl font-bold text-center mb-2">Selamat Datang!</h1>
        <p className="text-muted-foreground text-center mb-6 text-sm">Masuk untuk melanjutkan ke Persona+</p>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">Password</label>
              <Link href="#" className="text-xs text-primary hover:underline">Lupa Password?</Link>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={loading} className="w-full py-6 rounded-full text-md font-bold">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Masuk"}
            </Button>
          </div>
        </form>

        <div className="mt-6 flex flex-col gap-2">
          <p className="text-xs text-center text-muted-foreground uppercase font-bold mb-2">Atau Gunakan Demo Akun</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => autofill('customer')}>Isi Demo Customer</Button>
            <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => autofill('vendor')}>Isi Demo Vendor</Button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Belum punya akun? <Link href="/register" className="text-primary font-bold hover:underline">Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
}
