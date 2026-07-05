"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/store/booking";
import { useOrderStore } from "@/store/order";
import { VendorService, Vendor } from "@/services/vendor.service";
import { BookingService } from "@/services/booking.service";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight, Calendar as CalendarIcon, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BookingPage({ params }: { params: { vendorId: string } }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [voucherInput, setVoucherInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const { bookingData, setVendor: setStoreVendor, setService, setSchedule, setNote, applyVoucher } = useBookingStore();
  const addOrder = useOrderStore((state) => state.addOrder);

  useEffect(() => {
    async function loadVendor() {
      const res = await VendorService.getVendors();
      const v = res.data.find(x => x.id === params.vendorId);
      if (v) {
        setVendor(v);
        setStoreVendor(v.id);
      }
      setLoading(false);
    }
    loadVendor();
  }, [params.vendorId, setStoreVendor]);

  useEffect(() => {
    if (bookingData.date && vendor) {
      BookingService.getAvailableSlots(vendor.id, bookingData.date).then(res => {
        if (res.success) setAvailableSlots(res.data);
      });
    }
  }, [bookingData.date, vendor]);

  const handleApplyVoucher = async () => {
    if (!voucherInput) return;
    const res = await BookingService.validateVoucher(voucherInput);
    if (res.success && res.discount) {
      applyVoucher(voucherInput, res.discount);
      alert(`Voucher berhasil! Diskon Rp ${res.discount.toLocaleString()}`);
    } else {
      alert(res.error);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    
    const subtotal = bookingData.price ? parseInt(bookingData.price.replace(/[^0-9]/g, "")) : 0;
    const total = subtotal > 0 ? subtotal - bookingData.discount : 0;
    const formattedTotal = `Rp ${total.toLocaleString('id-ID')}`;

    // Add to Global Store
    const orderId = addOrder({
      customerId: "cust-1",
      customerName: "Budi (Dummy)",
      vendorId: vendor?.id || "vendor-0",
      vendorName: vendor?.name || "Unknown Vendor",
      serviceName: bookingData.serviceName || "Layanan",
      date: bookingData.date || "",
      time: bookingData.time || "",
      total: formattedTotal
    });

    // Simulasi delay pembayaran
    setTimeout(() => {
      router.push(`/booking/success/${orderId}`);
    }, 1500);
  };

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!vendor) return <div className="p-20 text-center">Vendor tidak ditemukan.</div>;

  const parsePrice = (priceStr: string | null) => {
    if (!priceStr) return 0;
    return parseInt(priceStr.replace(/[^0-9]/g, ""));
  };
  
  const subtotal = parsePrice(bookingData.price);
  const total = subtotal > 0 ? subtotal - bookingData.discount : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href={`/vendors/${vendor.slug}`} className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 text-sm">
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Vendor
      </Link>
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold font-heading">Booking Layanan</h1>
        
        {/* Stepper indicator */}
        <div className="hidden sm:flex items-center gap-2 text-sm font-medium">
          <span className={`${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>1. Jadwal</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className={`${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>2. Ringkasan</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className={`${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>3. Bayar</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Form Area */}
        <div className="flex-1 bg-card border rounded-3xl p-6 shadow-sm">
          
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="font-bold mb-4 text-lg">Pilih Layanan</h3>
                <div className="grid gap-3">
                  {vendor.services.map(svc => (
                    <label key={svc.id} className={`flex items-start justify-between p-4 border rounded-xl cursor-pointer transition-colors ${bookingData.serviceId === svc.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}>
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="service" 
                          className="mt-1"
                          checked={bookingData.serviceId === svc.id}
                          onChange={() => setService(svc.id, svc.name, svc.price)}
                        />
                        <div>
                          <p className="font-bold">{svc.name}</p>
                          <p className="text-sm text-muted-foreground">{svc.description}</p>
                        </div>
                      </div>
                      <span className="font-bold text-primary">{svc.price}</span>
                    </label>
                  ))}
                </div>
              </div>

              {bookingData.serviceId && (
                <div>
                  <h3 className="font-bold mb-4 text-lg">Pilih Tanggal & Waktu</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Tanggal</label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                          type="date" 
                          className="w-full pl-10 pr-4 py-2 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                          value={bookingData.date || ""}
                          onChange={(e) => setSchedule(e.target.value, "")}
                        />
                      </div>
                    </div>
                    {bookingData.date && (
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Waktu Tersedia</label>
                        <div className="flex flex-wrap gap-2">
                          {availableSlots.length > 0 ? availableSlots.map(time => (
                            <button 
                              key={time}
                              onClick={() => setSchedule(bookingData.date!, time)}
                              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${bookingData.time === time ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:border-primary'}`}
                            >
                              <Clock className="w-3 h-3 inline mr-1" /> {time}
                            </button>
                          )) : (
                            <p className="text-sm text-muted-foreground">Tidak ada slot tersedia.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!bookingData.serviceId || !bookingData.date || !bookingData.time}
                  size="lg"
                  className="rounded-full px-8"
                >
                  Selanjutnya <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="font-bold text-lg mb-4">Ringkasan Pesanan</h3>
              
              <div className="bg-muted/50 p-4 rounded-xl space-y-4">
                <div className="flex justify-between items-start border-b pb-4">
                  <div>
                    <h4 className="font-bold">{bookingData.serviceName}</h4>
                    <p className="text-sm text-muted-foreground">{vendor.name}</p>
                  </div>
                  <span className="font-bold">{bookingData.price}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                  <div>
                    <p className="text-muted-foreground mb-1">Tanggal</p>
                    <p className="font-medium flex items-center gap-1"><CalendarIcon className="w-3 h-3"/> {bookingData.date}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Waktu</p>
                    <p className="font-medium flex items-center gap-1"><Clock className="w-3 h-3"/> {bookingData.time}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Catatan untuk Vendor (Opsional)</label>
                <textarea 
                  className="w-full p-3 border rounded-xl bg-background min-h-[100px] focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                  placeholder="Misal: Alamat detail atau request khusus..."
                  value={bookingData.note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)} className="rounded-full">
                  Kembali
                </Button>
                <Button onClick={() => setStep(3)} size="lg" className="rounded-full px-8">
                  Konfirmasi & Bayar <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="font-bold text-lg mb-4">Metode Pembayaran (Simulasi)</h3>
              
              <div className="space-y-3">
                {['Transfer BCA', 'GoPay', 'OVO'].map(method => (
                  <label key={method} className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-primary/50">
                    <input type="radio" name="payment" className="mt-0.5" defaultChecked={method === 'Transfer BCA'} />
                    <span className="font-medium">{method}</span>
                  </label>
                ))}
              </div>
              
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm text-primary/90">Ini adalah simulasi pembayaran. Uang tidak akan ditarik. Klik bayar untuk mensimulasikan booking sukses.</p>
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)} disabled={processing} className="rounded-full">
                  Kembali
                </Button>
                <Button onClick={handlePayment} disabled={processing} size="lg" className="rounded-full px-8">
                  {processing ? "Memproses..." : "Bayar Sekarang"}
                </Button>
              </div>
            </div>
          )}
          
        </div>

        {/* Sidebar Summary */}
        <div className="w-full md:w-80 shrink-0">
          <div className="bg-card border rounded-3xl p-6 shadow-sm sticky top-24">
            <h3 className="font-bold mb-4 border-b pb-4">Detail Biaya</h3>
            
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>Rp {subtotal.toLocaleString()}</span>
              </div>
              {bookingData.discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Diskon Voucher</span>
                  <span>- Rp {bookingData.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-3 font-bold text-base">
                <span>Total Biaya</span>
                <span className="text-primary">Rp {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Voucher input */}
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Kode Voucher (ex: PERSONA20)" 
                className="flex-1 px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:border-primary"
                value={voucherInput}
                onChange={(e) => setVoucherInput(e.target.value)}
              />
              <Button onClick={handleApplyVoucher} variant="secondary" size="sm" className="rounded-lg">Terapkan</Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
