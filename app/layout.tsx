import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const helixaRegular = localFont({
  src: "../public/fonts/Helixa-Regular.woff",
  variable: "--font-helixa-regular",
  weight: "400",
});

const helixaBold = localFont({
  src: "../public/fonts/Helixa-Bold.woff",
  variable: "--font-helixa-bold",
  weight: "700",
});

const helixaLight = localFont({
  src: "../public/fonts/Helixa-Light.woff",
  variable: "--font-helixa-light",
  weight: "300",
});

const helixaBook = localFont({
  src: "../public/fonts/Helixa-Book.woff",
  variable: "--font-helixa-book",
  weight: "400",
});

const helixaBlack = localFont({
  src: "../public/fonts/Helixa-Black.woff",
  variable: "--font-helixa-black",
  weight: "900",
});

const helixaThin = localFont({
  src: "../public/fonts/Helixa-Thin.woff",
  variable: "--font-helixa-thin",
  weight: "100",
});

export const metadata: Metadata = {
  title: "Operiq - Panel de Control",
  description: "Monitoreo de métricas y detección de fraudes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${helixaRegular.variable} ${helixaBold.variable} ${helixaLight.variable} ${helixaBook.variable} ${helixaBlack.variable} ${helixaThin.variable} antialiased dark bg-black`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}