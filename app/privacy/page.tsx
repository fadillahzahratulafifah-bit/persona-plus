export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 pt-24 pb-12 max-w-4xl">
      <h1 className="text-4xl font-bold font-heading mb-2">Kebijakan Privasi</h1>
      <p className="text-muted-foreground mb-8">Terakhir diperbarui: 1 Juli 2026</p>
      <div className="prose max-w-none space-y-6 text-foreground/80">
        <h2 className="text-2xl font-bold">1. Informasi yang Kami Kumpulkan</h2>
        <p>Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, seperti nama, alamat email, nomor telepon, dan foto profil saat mendaftar atau memperbarui akun Anda.</p>
        <h2 className="text-2xl font-bold">2. Cara Kami Menggunakan Informasi</h2>
        <p>Informasi Anda digunakan untuk: menyediakan dan meningkatkan layanan kami, memproses transaksi, mengirimkan notifikasi terkait layanan, dan berkomunikasi dengan Anda.</p>
        <h2 className="text-2xl font-bold">3. Keamanan Data</h2>
        <p>Kami menggunakan enkripsi industri standar dan Firebase Security Rules untuk melindungi data Anda dari akses tidak sah.</p>
        <h2 className="text-2xl font-bold">4. Berbagi Data</h2>
        <p>Kami tidak menjual, memperdagangkan, atau menyewakan informasi pribadi pengguna kepada pihak ketiga manapun.</p>
        <h2 className="text-2xl font-bold">5. Kontak</h2>
        <p>Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, hubungi kami di <a href="mailto:help.personal@gmail.com" className="text-primary">help.personal@gmail.com</a>.</p>
      </div>
    </div>
  );
}
