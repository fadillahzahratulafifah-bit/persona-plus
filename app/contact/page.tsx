export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 pt-24 pb-12 max-w-2xl">
      <h1 className="text-4xl font-bold font-heading mb-4">Hubungi Kami</h1>
      <p className="text-muted-foreground text-lg mb-8">Kami siap membantu Anda 24/7.</p>
      <div className="bg-card border rounded-3xl p-8 space-y-6">
        <div>
          <h3 className="font-bold text-lg mb-1">📞 Telepon</h3>
          <a href="tel:085173458645" className="text-primary font-medium hover:underline">085173458645</a>
          <p className="text-sm text-muted-foreground">Senin-Jumat, 08:00 - 17:00 WIB</p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-1">📧 Email</h3>
          <a href="mailto:help.personal@gmail.com" className="text-primary font-medium hover:underline">help.personal@gmail.com</a>
          <p className="text-sm text-muted-foreground">Respon dalam 1x24 jam</p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-1">💬 Live Chat</h3>
          <p className="text-muted-foreground text-sm">Tersedia di halaman Bantuan untuk respon instan dengan tim support kami.</p>
        </div>
      </div>
    </div>
  );
}
