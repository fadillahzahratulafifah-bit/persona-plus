export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 pt-24 pb-12 max-w-4xl">
      <h1 className="text-4xl font-bold font-heading mb-4">Tentang Persona+</h1>
      <p className="text-muted-foreground text-lg mb-8">Platform marketplace berbasis web yang menghubungkan pelanggan dengan penyedia jasa terbaik.</p>
      <div className="prose max-w-none space-y-6 text-foreground/80">
        <p>Persona+ adalah platform digital yang didirikan dengan misi menghubungkan individu yang membutuhkan layanan Makeup Artist (MUA), Hair Stylist, dan penyewaan kostum dengan para vendor profesional di seluruh Indonesia.</p>
        <p>Kami percaya bahwa setiap momen spesial dalam hidup Anda — wisuda, pernikahan, pesta cosplay, atau acara kreatif lainnya — layak mendapatkan tampilan terbaik. Dengan Persona+, menemukan vendor terpercaya menjadi mudah, cepat, dan aman.</p>
        <h2 className="text-2xl font-bold mt-8">Visi Kami</h2>
        <p>Menjadi marketplace nomor satu di Asia Tenggara untuk layanan kecantikan, makeup, dan cosplay yang menghubungkan jutaan pelanggan dengan ribuan vendor profesional.</p>
        <h2 className="text-2xl font-bold mt-8">Nilai-nilai Kami</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Kepercayaan</strong> — Setiap vendor telah terverifikasi oleh tim kami.</li>
          <li><strong>Kualitas</strong> — Standar layanan terjaga melalui sistem rating dan ulasan.</li>
          <li><strong>Kemudahan</strong> — Booking, komunikasi, dan pembayaran dalam satu platform.</li>
          <li><strong>Komunitas</strong> — Kami membangun ekosistem yang mengangkat karir vendor lokal.</li>
        </ul>
      </div>
    </div>
  );
}
