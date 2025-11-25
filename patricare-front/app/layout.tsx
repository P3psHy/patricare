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
        <div className="container w-full flex gap-1">
          <div className="w-1/4 sidenav">
            <Sidenav />
          </div>
          <div className="max-h-100vh flex-1 overflow-y-auto w-3/4">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
