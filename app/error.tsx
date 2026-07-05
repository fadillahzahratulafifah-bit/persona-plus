"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center animate-in zoom-in duration-500">
      <div className="w-24 h-24 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-bold font-heading mb-4 text-foreground">Aduh, Terjadi Kesalahan</h1>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Maaf, sistem kami mengalami sedikit kendala saat mencoba memproses permintaan Anda. Jangan khawatir, tim kami sudah diberitahu.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset} size="lg" className="rounded-full px-8">
          Coba Lagi
        </Button>
        <Button onClick={() => window.location.href = '/'} variant="outline" size="lg" className="rounded-full px-8">
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
}
