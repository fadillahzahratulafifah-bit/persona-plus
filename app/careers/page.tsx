export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 pt-24 pb-12 max-w-4xl">
      <h1 className="text-4xl font-bold font-heading mb-4">Karir di Persona+</h1>
      <p className="text-muted-foreground text-lg mb-10">Bergabunglah dengan tim kami dan bantu wujudkan visi kecantikan untuk semua.</p>
      <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 text-center">
        <p className="text-2xl font-bold mb-2">Saat ini belum ada posisi terbuka</p>
        <p className="text-muted-foreground mb-4">Kami terus berkembang! Kirim CV Anda untuk dipertimbangkan di masa mendatang.</p>
        <a href="mailto:help.personal@gmail.com?subject=Lamaran Kerja Persona+" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors">Kirim CV Anda</a>
      </div>
    </div>
  );
}
