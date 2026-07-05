"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, MessageCircle, PhoneCall, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { ChatService } from "@/services/chat.service";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const FAQ_DATA = [
  {
    category: "Pertanyaan Umum",
    items: [
      { q: "Apa itu Persona+?", a: "Persona+ adalah marketplace yang menghubungkan Anda dengan penyedia jasa Makeup Artist (MUA), Hair Stylist, dan penyewaan kostum terbaik." },
      { q: "Bagaimana cara membuat akun?", a: "Anda dapat menekan tombol 'Register' di pojok kanan atas, lalu mendaftar menggunakan email atau akun Google Anda." }
    ]
  },
  {
    category: "Booking & Pemesanan",
    items: [
      { q: "Apakah saya bisa membatalkan pesanan?", a: "Ya, pembatalan dapat dilakukan maksimal H-3 sebelum jadwal layanan untuk pengembalian dana 100%. Untuk H-1, dana akan dipotong 50%." },
      { q: "Bagaimana jika vendor membatalkan pesanan saya?", a: "Jika vendor membatalkan secara sepihak, dana Anda akan dikembalikan 100% dan kami akan membantu mencarikan vendor pengganti." }
    ]
  },
  {
    category: "Pembayaran",
    items: [
      { q: "Metode pembayaran apa saja yang didukung?", a: "Kami mendukung Transfer Bank, Virtual Account, Kartu Kredit, dan e-Wallet (OVO, GoPay, Dana)." },
      { q: "Kapan pembayaran saya diteruskan ke vendor?", a: "Dana Anda akan kami simpan dengan aman dan baru diteruskan ke vendor setelah layanan berhasil diselesaikan." }
    ]
  }
];

export default function HelpCenterPage() {
  const [openIndex, setOpenIndex] = useState<string>("0-0");
  const [search, setSearch] = useState("");
  const [startingChat, setStartingChat] = useState(false);
  const user = useAuthStore(state => state.user);
  const router = useRouter();

  const toggleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? "" : id);
  };

  const handleLiveChat = async () => {
    if (!user) { router.push("/login"); return; }
    setStartingChat(true);
    try {
      // Find admin account
      const q = query(collection(db, "users"), where("role", "==", "admin"));
      const snap = await getDocs(q);
      if (snap.empty) { alert("Admin belum tersedia. Hubungi via telepon/email."); setStartingChat(false); return; }
      const adminDoc = snap.docs[0];
      const adminId = adminDoc.id;
      const adminName = adminDoc.data().name || "Admin Persona+";
      const res = await ChatService.getOrCreateChat(user.id, user.name, adminId, adminName);
      if (res.success && res.chatId) {
        router.push("/dashboard/chat");
      } else {
        alert("Gagal membuka chat. Coba lagi.");
      }
    } catch { alert("Terjadi kesalahan."); }
    finally { setStartingChat(false); }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 pt-24 pb-12 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-primary/5 rounded-3xl p-8 md:p-16 text-center mb-12 border border-primary/10">
        <h1 className="text-4xl font-bold font-heading mb-4">Pusat Bantuan</h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
          Punya pertanyaan atau kendala? Temukan jawaban untuk berbagai pertanyaan seputar penggunaan Persona+.
        </p>
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Cari topik bantuan (cth: refund, ganti jadwal)..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-full border bg-background focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* FAQ Section */}
        <div className="w-full lg:w-2/3 space-y-10">
          {FAQ_DATA.map((section, sIdx) => {
            // Simple client search filter
            const filteredItems = section.items.filter(item => 
              item.q.toLowerCase().includes(search.toLowerCase()) || 
              item.a.toLowerCase().includes(search.toLowerCase())
            );

            if (filteredItems.length === 0 && search) return null;

            return (
              <div key={sIdx} className="space-y-4">
                <h2 className="text-2xl font-bold font-heading mb-6">{section.category}</h2>
                <div className="space-y-3">
                  {filteredItems.map((item, iIdx) => {
                    const id = `${sIdx}-${iIdx}`;
                    const isOpen = openIndex === id;
                    return (
                      <div key={iIdx} className="border rounded-2xl bg-card overflow-hidden">
                        <button 
                          onClick={() => toggleAccordion(id)}
                          className="w-full px-6 py-4 flex items-center justify-between font-bold text-left hover:bg-muted/30 transition-colors"
                        >
                          {item.q}
                          <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                        <div 
                          className={`px-6 text-muted-foreground text-sm leading-relaxed overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 py-4 border-t bg-muted/10" : "max-h-0"}`}
                        >
                          {item.a}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Support Sidebar */}
        <div className="w-full lg:w-1/3">
          <div className="bg-card border rounded-3xl p-6 sticky top-24 shadow-sm">
            <h3 className="font-bold text-xl mb-2">Masih Butuh Bantuan?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Tim support kami siap membantu Anda 24/7. Pilih metode kontak di bawah ini.
            </p>

            <div className="space-y-4">
              <a href="#" onClick={(e) => { e.preventDefault(); handleLiveChat(); }}
                className="w-full flex justify-start items-center gap-3 py-6 px-4 rounded-2xl border hover:bg-muted transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  {startingChat ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageCircle className="w-5 h-5" />}
                </div>
                <div className="text-left">
                  <p className="font-bold">Live Chat</p>
                  <p className="text-xs text-muted-foreground">{startingChat ? 'Menghubungkan...' : 'Balas instan via admin'}</p>
                </div>
              </a>
              <a href="tel:085173458645"
                className="w-full flex justify-start items-center gap-3 py-6 px-4 rounded-2xl border hover:bg-muted transition-colors">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold">Telepon</p>
                  <p className="text-xs text-muted-foreground">085173458645 (08:00-17:00 WIB)</p>
                </div>
              </a>
              <a href="mailto:help.personal@gmail.com"
                className="w-full flex justify-start items-center gap-3 py-6 px-4 rounded-2xl border hover:bg-muted transition-colors">
                <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold">Email</p>
                  <p className="text-xs text-muted-foreground">help.personal@gmail.com</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
