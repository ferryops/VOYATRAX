import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VoyaTrax - Aplikasi Pemesanan Tiket Pesawat",
  description: "Pemesanan tiket pesawat mudah & murah, hanya di VoyaTrax.",
  openGraph: {
    title: "VoyaTrax - Aplikasi Pemesanan Tiket Pesawat",
    description: "Pemesanan tiket pesawat mudah & murah, hanya di VoyaTrax.",
    url: "https://voyatrax.com",
    siteName: "VoyaTrax",
    images: [
      {
        url: "https://dummyimage.com/1200x630/ccc/333&text=VoyaTrax",
        width: 1200,
        height: 630,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
