import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Payment Pipeline - Real-time Settlement Visualizer",
  description: "A real-time visualization of how payments flow through a banking system — from initiation through fraud detection, balance verification, and final settlement.",
  keywords: ["payment", "banking", "pipeline", "settlement", "fintech", "visualization"],
  authors: [{ name: "Nehman", url: "https://nehmans-portfolio.vercel.app" }],
  openGraph: {
    title: "Payment Pipeline - Real-time Settlement Visualizer",
    description: "Watch transactions flow through fraud detection, balance verification, and clearing stages in real-time.",
    type: "website",
  },
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
        {children}
      </body>
    </html>
  );
}
