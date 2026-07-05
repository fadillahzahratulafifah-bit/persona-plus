"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccess(true);
    } catch (err: any) {
      if (err.code === `"auth/user-not-found"`) {
        setError("Email ini tidak terdaftar di sistem kami.");
      } else if (err.code === `"auth/invalid-email"`) {
        setError("Format email tidak valid.");
      } else {
        setError(err.message || "Terjadi kesalahan. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 pt-10">
      <div className="w-full max-w-md bg-card border rounded-3xl p-8 shadow-sm animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center mb-8">
          <Link href="/"><div className="dark:hidden"><Image src="/images/LOGO.webp" alt="Persona+" width={280} height={90} className="h-20 w-auto object-contain" /></div><div className="hidden dark:block"><Image src="/images/Logo White.webp" alt="Persona+" width={280} height={90} className="h-20 w-auto object-contain" /></div></Link>
        </div>
        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-600" /></div>
            <h1 className="text-2xl font-bold mb-2">Email Terkirim!</h1>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">Link untuk mereset password telah dikirim ke <strong>{email}</strong>. Periksa kotak masuk atau folder spam Anda.</p>
            <Link href="/login"><Button className="w-full rounded-full"><ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Login</Button></Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center mb-2">Lupa Password?</h1>
            <p className="text-muted-foreground text-center mb-6 text-sm">Masukkan email akun Anda, kami akan mengirimkan link untuk mereset password.</p>
            {error && (<div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4 text-center font-medium">{error}</div>)}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" className="w-full pl-10 pr-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:outline-none" required />
                </div>
              </div>
              <div className="pt-2">
                <Button type="submit" disabled={loading} className="w-full py-6 rounded-full font-bold">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Kirim Link Reset"}
                </Button>
              </div>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">Ingat password Anda? <Link href="/login" className="text-primary font-bold hover:underline">Masuk di sini</Link></p>
          </>
        )}
      </div>
    </div>
  );
}
