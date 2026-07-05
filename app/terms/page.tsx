export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 pt-24 pb-12 max-w-4xl">
      <h1 className="text-4xl font-bold font-heading mb-2">Syarat dan Ketentuan</h1>
      <p className="text-muted-foreground mb-8">Terakhir diperbarui: 1 Juli 2026</p>
      <div className="prose max-w-none space-y-6 text-foreground/80">
        <h2 className="text-2xl font-bold">1. Penerimaan Syarat</h2>
        <p>Dengan menggunakan Persona+, Anda menyetujui syarat dan ketentuan ini. Jika tidak setuju, harap jangan menggunakan layanan kami.</p>
        <h2 className="text-2xl font-bold">2. Penggunaan Platform</h2>
        <p>Persona+ adalah marketplace yang menghubungkan pelanggan dengan vendor layanan kecantikan dan kostum. Kami tidak bertanggung jawab secara langsung atas kualitas layanan yang diberikan oleh vendor.</p>
        <h2 className="text-2xl font-bold">3. Akun Pengguna</h2>
        <p>Anda bertanggung jawab menjaga kerahasiaan akun Anda. Segera hubungi kami jika terjadi penggunaan akun tanpa izin.</p>
        <h2 className="text-2xl font-bold">4. Kebijakan Pembatalan</h2>
        <p>Pembatalan dapat dilakukan maksimal H-3 sebelum jadwal layanan untuk pengembalian dana 100%. Pembatalan H-1 dikenakan potongan 50%.</p>
        <h2 className="text-2xl font-bold">5. Kontak</h2>
        <p>Pertanyaan terkait syarat ini dapat dikirim ke <a href="mailto:help.personal@gmail.com" className="text-primary">help.personal@gmail.com</a>.</p>
      </div>
    </div>
  );
}
