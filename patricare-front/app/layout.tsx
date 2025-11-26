import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Sidenav from "./components/sidenav/Sidenav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Patricare",
  description: "Gestion immobilière simplifiée",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="w-full h-full max-h-full flex">
          <div className="h-full flex-none">
            <Sidenav />
          </div>
          <div className="flex-auto w-full max-h-screen p-6 overflow-y-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
