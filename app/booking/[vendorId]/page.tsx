"use client";

import { use, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { DbService, VendorServiceItem } from "@/services/db.service";
import { OrderService } from "@/services/order.service";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight, Calendar as CalendarIcon, Clock, ArrowLeft, User, MessageSquare, Ticket, Loader2 } from "lucide-react";
import Link from "next/link";

export default function BookingPage({ params: paramsPromise }: { params: Promise<{ vendorId: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedServiceId = searchParams.get("serviceId");

  const [step, setStep] = useState(1);
  const [vendor, setVendor] = useState<any>(null);
  const [services, setServices] = useState<VendorServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Booking form state
  const [selectedServiceId, setSelectedServiceId] = useState(preselectedServiceId || "");
  const [selectedService, setSelectedService] = useState<VendorServiceItem | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Transfer BCA");
  // Voucher state
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [voucherError, setVoucherError] = useState("");

  const user = useAuthStore(state => state.user);

  // Predefined time slots
  const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

  useEffect(() => {
    async function loadData() {
      // Load vendor from Firebase
      const vendorRes = await DbService.getVendorById(params.vendorId);
      if (vendorRes.success && vendorRes.data) {
        setVendor(vendorRes.data);
      }

      // Load vendor's services
      const svcRes = await DbService.getVendorServices(params.vendorId);
      if (svcRes.success) {
        setServices(svcRes.data);
        // Preselect if serviceId is in URL
        if (preselectedServiceId) {
          const svc = svcRes.data.find(s => s.id === preselectedServiceId);
          if (svc) setSelectedService(svc);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [params.vendorId, preselectedServiceId]);

  const handleSelectService = (svc: VendorServiceItem) => {
    setSelectedServiceId(svc.id);
    setSelectedService(svc);
  };

  const parsePrice = (priceStr: string) => {
    if (!priceStr) return 0;
    return parseInt(priceStr.replace(/[^0-9]/g, "") || "0");
  };

  const getDiscountAmount = () => {
    if (!appliedVoucher || !selectedService) return 0;
    const base = parsePrice(selectedService.price);
    if (appliedVoucher.type === 'percentage') {
      const disc = Math.round(base * appliedVoucher.value / 100);
      return appliedVoucher.maxDiscount ? Math.min(disc, appliedVoucher.maxDiscount) : disc;
    }
    return appliedVoucher.value; // flat discount
  };

  const getFinalTotal = () => {
    if (!selectedService) return 0;
    return Math.max(0, parsePrice(selectedService.price) - getDiscountAmount());
  };

  const formatRupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setVoucherLoading(true);
    setVoucherError("");
    setAppliedVoucher(null);
    try {
      const q = query(collection(db, "vouchers"), where("code", "==", voucherCode.trim().toUpperCase()), where("isActive", "==", true));
      const snap = await getDocs(q);
      if (snap.empty) { setVoucherError("Kode voucher tidak valid atau sudah tidak aktif."); setVoucherLoading(false); return; }
      const vData = { id: snap.docs[0].id, ...snap.docs[0].data() } as any;
      // Check expiry
      if (vData.expiresAt && new Date(vData.expiresAt) < new Date()) { setVoucherError("Voucher sudah kadaluarsa."); setVoucherLoading(false); return; }
      // Check min purchase
      const base = selectedService ? parsePrice(selectedService.price) : 0;
      if (vData.minPurchase && base < vData.minPurchase) { setVoucherError(`Minimum belanja ${formatRupiah(vData.minPurchase)} untuk voucher ini.`); setVoucherLoading(false); return; }
      setAppliedVoucher(vData);
    } catch { setVoucherError("Gagal memvalidasi voucher."); }
    setVoucherLoading(false);
  };

  const handleConfirmPayment = async () => {
    if (!user) {
      alert("Harap login terlebih dahulu.");
      router.push("/login");
      return;
    }
    if (!selectedService || !date || !time || !phone || !address) {
      alert("Lengkapi semua data booking terlebih dahulu, termasuk No HP dan Alamat.");
      return;
    }

    setProcessing(true);

    const finalTotal = getFinalTotal();
    const result = await OrderService.createOrder({
      customerId: user.id,
      customerName: user.name,
      vendorId: params.vendorId,
      vendorName: vendor?.name || "Unknown Vendor",
      serviceName: selectedService.name,
      date,
      time,
      customerPhone: phone,
      customerAddress: address,
      total: appliedVoucher ? formatRupiah(finalTotal) : selectedService.price,
      note,
      paymentMethod,
      ...(appliedVoucher ? { voucherCode: appliedVoucher.code, discountAmount: getDiscountAmount() } : {}),
    });

    if (result.success && result.orderId) {
      router.push(`/booking/success/${result.orderId}`);
    } else {
      setProcessing(false);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const canProceedStep1 = selectedServiceId && date && time;

  if (loading) return <div className="container mx-auto px-4 py-32 text-center">Memuat data vendor...</div>;
  if (!vendor) return <div className="container mx-auto px-4 py-32 text-center">Vendor tidak ditemukan.</div>;

  return (
    <div className="container mx-auto px-4 py-8 pt-28 max-w-4xl">
      <Link href={`/vendors/${params.vendorId}`} className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 text-sm">
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Profil Vendor
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Booking Layanan</h1>
          <p className="text-muted-foreground text-sm">di <span className="font-semibold text-foreground">{vendor.name}</span></p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 text-sm font-medium">
          {[{ n: 1, label: "Pilih Layanan" }, { n: 2, label: "Konfirmasi" }, { n: 3, label: "Pembayaran" }].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s.n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{s.n}</div>
              <span className={`hidden sm:block text-xs ${step >= s.n ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>{s.label}</span>
              {i < 2 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Form */}
        <div className="flex-1 bg-card border rounded-3xl p-6 shadow-sm">

          {/* STEP 1: Pick Service, Date, Time */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* Services */}
              <div>
                <h3 className="font-bold mb-4 text-lg">Pilih Layanan</h3>
                {services.length === 0 ? (
                  <div className="p-6 border rounded-xl text-center text-muted-foreground bg-muted/30">
                    Vendor ini belum menambahkan layanan. Silakan hubungi vendor secara langsung.
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {services.map(svc => (
                      <label
                        key={svc.id}
                        onClick={() => handleSelectService(svc)}
                        className={`flex items-start justify-between p-4 border rounded-xl cursor-pointer transition-all ${selectedServiceId === svc.id ? 'border-primary bg-primary/5 shadow-sm' : 'hover:border-primary/50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${selectedServiceId === svc.id ? 'border-primary' : 'border-muted-foreground/50'}`}>
                            {selectedServiceId === svc.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                          </div>
                          <div>
                            <p className="font-bold">{svc.name}</p>
                            <p className="text-sm text-muted-foreground">{svc.description}</p>
                            {svc.category === 'costume' && (
                              <div className="flex gap-1 mt-1">
                                {svc.anime && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{svc.anime}</span>}
                                {svc.character && <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">{svc.character}</span>}
                                {svc.size && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">{svc.size}</span>}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="font-bold text-primary shrink-0 ml-4">{svc.price}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Date & Time - only show when service selected */}
              {selectedServiceId && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <h3 className="font-bold mb-4 text-lg">Pilih Tanggal & Waktu</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Tanggal</label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-10 pr-4 py-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                          value={date}
                          onChange={(e) => { setDate(e.target.value); setTime(""); }}
                        />
                      </div>
                    </div>

                    {date && (
                      <div className="space-y-2 animate-in fade-in duration-300">
                        <label className="text-sm font-medium text-muted-foreground">Waktu</label>
                        <div className="flex flex-wrap gap-2">
                          {TIME_SLOTS.map(slot => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setTime(slot)}
                              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${time === slot ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'bg-background hover:border-primary/60 hover:bg-primary/5'}`}
                            >
                              <Clock className="w-3 h-3 inline mr-1.5" />{slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  size="lg"
                  className="rounded-full px-8"
                >
                  Selanjutnya <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Review & Note */}
          {step === 2 && selectedService && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="font-bold text-lg mb-4">Ringkasan Pesanan</h3>

              <div className="bg-muted/50 p-5 rounded-2xl space-y-4 border">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg">{selectedService.name}</h4>
                    <p className="text-sm text-muted-foreground">{vendor.name}</p>
                  </div>
                  <span className="font-bold text-primary text-lg">{selectedService.price}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground text-xs">Tanggal</p>
                      <p className="font-semibold">{new Date(date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground text-xs">Waktu</p>
                      <p className="font-semibold">{time} WIB</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer info */}
              {user && (
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border">
                  <User className="w-5 h-5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Pemesan</p>
                    <p className="font-semibold">{user.name} <span className="font-normal text-muted-foreground text-sm">({user.email})</span></p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    No. WhatsApp / HP <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="tel"
                    className="w-full p-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                    placeholder="Contoh: 081234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    Alamat Lengkap <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-xl bg-background min-h-[80px] focus:ring-2 focus:ring-primary focus:outline-none text-sm resize-none"
                    placeholder="Alamat acara / pengiriman kostum..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Catatan Tambahan <span className="text-muted-foreground font-normal">(opsional)</span>
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-xl bg-background min-h-[80px] focus:ring-2 focus:ring-primary focus:outline-none text-sm resize-none"
                    placeholder="Misal: Warna tema, request khusus, dll..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)} className="rounded-full">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                </Button>
                <Button onClick={() => setStep(3)} disabled={!phone || !address} size="lg" className="rounded-full px-8">
                  Lanjutkan ke Pembayaran <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="font-bold text-lg mb-4">Metode Pembayaran</h3>

              <div className="space-y-3">
                {['Transfer BCA', 'Transfer Mandiri', 'GoPay', 'OVO', 'DANA', 'Bayar di Tempat (COD)'].map(method => (
                  <label
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === method ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === method ? 'border-primary' : 'border-muted-foreground/50'}`}>
                      {paymentMethod === method && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <span className="font-medium">{method}</span>
                    {method === 'Bayar di Tempat (COD)' && (
                      <span className="ml-auto text-xs bg-success/15 text-success px-2 py-0.5 rounded-full font-medium">COD</span>
                    )}
                  </label>
                ))}
              </div>

              {paymentMethod === 'Bayar di Tempat (COD)' && (
                <div className="bg-success/5 border border-success/20 p-4 rounded-xl flex gap-3 animate-in fade-in duration-300">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <p className="text-sm text-success/90">
                    <strong>Bayar di Tempat</strong>: Pembayaran dilakukan secara tunai saat vendor/jasa hadir ke lokasi Anda. Pastikan Anda menyiapkan uang pas sesuai harga layanan.
                  </p>
                </div>
              )}

              {/* Voucher Input */}
              <div className="border rounded-2xl p-5 space-y-3">
                <h4 className="font-semibold flex items-center gap-2 text-sm">
                  <Ticket className="w-4 h-4 text-primary" /> Kode Voucher / Promo
                </h4>
                {appliedVoucher ? (
                  <div className="flex items-center justify-between bg-success/5 border border-success/30 rounded-xl px-4 py-3">
                    <div>
                      <p className="font-bold text-success text-sm">{appliedVoucher.code} — {appliedVoucher.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Hemat {appliedVoucher.type === 'percentage' ? `${appliedVoucher.value}%` : formatRupiah(appliedVoucher.value)}
                        {appliedVoucher.maxDiscount ? ` (maks. ${formatRupiah(appliedVoucher.maxDiscount)})` : ''}
                      </p>
                    </div>
                    <button onClick={() => { setAppliedVoucher(null); setVoucherCode(""); }} className="text-xs text-destructive hover:underline">Hapus</button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={e => { setVoucherCode(e.target.value.toUpperCase()); setVoucherError(""); }}
                        onKeyDown={e => e.key === 'Enter' && handleApplyVoucher()}
                        placeholder="Masukkan kode voucher..."
                        className="flex-1 px-4 py-2.5 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none text-sm font-mono"
                      />
                      <Button onClick={handleApplyVoucher} disabled={!voucherCode.trim() || voucherLoading} className="rounded-xl px-5">
                        {voucherLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Pakai"}
                      </Button>
                    </div>
                    {voucherError && <p className="text-xs text-destructive">{voucherError}</p>}
                  </>
                )}
              </div>

              <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-primary/90">
                  Ini adalah simulasi pembayaran untuk demo. Klik <strong>"Konfirmasi Pesanan"</strong> untuk menyelesaikan booking dan mengirim notifikasi ke vendor.
                </p>
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)} disabled={processing} className="rounded-full">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                </Button>
                <Button
                  onClick={handleConfirmPayment}
                  disabled={processing}
                  size="lg"
                  className="rounded-full px-8 bg-primary hover:bg-primary/90"
                >
                  {processing ? "Memproses..." : "Konfirmasi Pesanan"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="w-full md:w-72 shrink-0">
          <div className="bg-card border rounded-3xl p-6 shadow-sm sticky top-24">
            <h3 className="font-bold mb-4 border-b pb-4">Ringkasan</h3>

            {selectedService ? (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Layanan</p>
                  <p className="font-semibold">{selectedService.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Vendor</p>
                  <p className="font-semibold">{vendor.name}</p>
                </div>
                {date && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Tanggal</p>
                    <p className="font-semibold">{date}</p>
                  </div>
                )}
                {time && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Waktu</p>
                    <p className="font-semibold">{time} WIB</p>
                  </div>
                )}
                <div className="border-t pt-3 space-y-1.5">
                  {appliedVoucher && (
                    <>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Harga Asli</span>
                        <span className="line-through text-muted-foreground">{selectedService.price}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-success">Diskon Voucher</span>
                        <span className="text-success font-semibold">-{formatRupiah(getDiscountAmount())}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center pt-1">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary text-base">
                      {appliedVoucher ? formatRupiah(getFinalTotal()) : selectedService.price}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Pilih layanan untuk melihat ringkasan.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
