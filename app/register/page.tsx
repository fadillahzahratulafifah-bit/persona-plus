"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore, UserRole } from "@/store/auth";
import { auth } from "@/lib/firebase";
import { sendEmailVerification } from "firebase/auth";
import { Loader2, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const register = useAuthStore(state => state.register);
  const loginWithGoogle = useAuthStore(state => state.loginWithGoogle);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const user = await register(name, email, password, role);
      if (user) {
        // Send email verification
        if (auth.currentUser) {
          try { await sendEmailVerification(auth.currentUser); } catch (_) {}
        }
        setRegisteredEmail(email);
        setVerificationSent(true);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      const user = await loginWithGoogle(role); // Use selected role for new users
      if (user) {
        if (user.role === 'vendor') router.push('/vendor-dashboard');
        else router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 pt-10">
      <div className="w-full max-w-md bg-card border rounded-3xl p-8 shadow-sm animate-in fade-in zoom-in duration-500">

        <div className="flex justify-center mb-8">
          <Link href="/">
            <div className="dark:hidden"><Image src="/images/LOGO.webp" alt="Persona+" width={280} height={90} className="h-20 w-auto object-contain" /></div>
            <div className="hidden dark:block"><Image src="/images/Logo White.webp" alt="Persona+" width={280} height={90} className="h-20 w-auto object-contain" /></div>
          </Link>
        </div>

        {verificationSent ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Verifikasi Email Anda!</h1>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Link aktivasi telah dikirim ke <strong>{registeredEmail}</strong>. Periksa kotak masuk atau folder spam Anda, lalu klik link untuk mengaktifkan akun.
            </p>
            <Link href="/login"><Button className="w-full rounded-full">Lanjut ke Login</Button></Link>
          </div>
        ) : (
          <>

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

          <div className="pt-2">
            <Button type="submit" disabled={loading} className="w-full py-6 rounded-full text-md font-bold mb-3">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Daftar Sekarang"}
            </Button>
            
            <Button type="button" variant="outline" className="w-full py-6 rounded-full text-md font-bold" onClick={handleGoogleRegister} disabled={loading}>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Daftar dengan Google
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Sudah punya akun? <Link href="/login" className="text-primary font-bold hover:underline">Masuk di sini</Link>
        </p>
        </>
        )}
      </div>
    </div>
  );
}
