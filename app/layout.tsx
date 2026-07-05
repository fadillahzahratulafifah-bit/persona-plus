import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Persona+ | Temukan MUA, Hair Stylist & Sewa Kostum Terbaik",
  description: "Platform marketplace nomor 1 di Indonesia untuk menghubungkan kamu dengan penyedia jasa Makeup Artist (MUA), Hair Stylist, Cosplayer, dan rental Kostum terpercaya.",
  keywords: ["MUA", "Makeup Artist", "Sewa Kostum", "Cosplay", "Hair Stylist", "Marketplace Jasa"],
  icons: {
    icon: "/images/LOGO.webp",
    apple: "/images/LOGO.webp",
  },
  openGraph: {
    title: "Persona+ | Be AnyOne, Be Yourself",
    description: "Temukan penyedia jasa Makeup Artist dan Sewa Kostum terbaik di kotamu.",
    type: "website",
    locale: "id_ID",
    images: ["/images/LOGO.webp"],
  },
};

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${poppins.variable} ${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
