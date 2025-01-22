import type { Metadata } from "next";
import { Geist, Geist_Mono, David_Libre } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const davidLibre = David_Libre({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Parthenos - Học Lịch Sử Cùng AI",
  description:
    "Dự án giúp học sinh tìm hiểu lịch sử dễ dàng hơn thông qua sự hỗ trợ của AI",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F3" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A1A" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={davidLibre.className} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
