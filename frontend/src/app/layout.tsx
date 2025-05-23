import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { Geist_Mono as FontMono } from "next/font/google";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ZBase - Hệ Thống Quản Lý Bán Hàng",
  description: "Hệ thống quản lý bán hàng toàn diện với Admin Dashboard và POS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} ${fontMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
