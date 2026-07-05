"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
const FAQS = [
  { q: "Apa itu Persona+?", a: "Persona+ adalah marketplace yang menghubungkan Anda dengan MUA, Hair Stylist, dan vendor kostum profesional." },
  { q: "Bagaimana cara memesan?", a: "Cari vendor, klik profil mereka, pilih layanan, isi formulir pemesanan, dan konfirmasi. Vendor akan menerima notifikasi pesanan Anda." },
  { q: "Apakah ada biaya pendaftaran?", a: "Pendaftaran sebagai pelanggan maupun vendor sepenuhnya GRATIS." },
  { q: "Bagaimana cara pembayaran?", a: "Pembayaran dilakukan secara langsung kepada vendor setelah layanan disepakati." },
  { q: "Apakah saya bisa membatalkan pesanan?", a: "Ya, pembatalan bisa dilakukan maksimal H-3 sebelum jadwal untuk refund 100%." },
  { q: "Bagaimana cara mendaftar sebagai vendor?", a: "Daftar akun, pilih peran 'Vendor', lengkapi profil, dan mulai tambahkan layanan Anda." },
];
export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="container mx-auto px-4 md:px-6 pt-24 pb-12 max-w-3xl">
      <h1 className="text-4xl font-bold font-heading mb-4">FAQ</h1>
      <p className="text-muted-foreground text-lg mb-10">Pertanyaan yang sering diajukan tentang Persona+.</p>
      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <div key={i} className="border rounded-2xl bg-card overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)}
              className="w-full px-6 py-4 flex justify-between items-center font-bold text-left hover:bg-muted/30 transition-colors">
              {faq.q}
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            <div className={`px-6 text-muted-foreground text-sm leading-relaxed overflow-hidden transition-all duration-300 ${open === i ? "max-h-48 py-4 border-t bg-muted/10" : "max-h-0"}`}>
              {faq.a}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
