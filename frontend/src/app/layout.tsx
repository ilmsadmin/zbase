import type { Metadata } from "next";
import { Roboto_Flex as FontSans } from "next/font/google";
import { Geist_Mono as FontMono } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/lib/react-query";
import { ToastProvider } from "@/components/ui/Toast";

const fontSans = FontSans({
  subsets: ["latin", "vietnamese"],
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
        <ReactQueryProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
