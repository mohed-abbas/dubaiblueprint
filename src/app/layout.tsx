import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Haffer font - uncomment when font files are added to /public/fonts/
// const haffer = localFont({
//   src: [
//     { path: '../../public/fonts/Haffer-Regular.woff2', weight: '400', style: 'normal' },
//     { path: '../../public/fonts/Haffer-Medium.woff2', weight: '500', style: 'normal' },
//   ],
//   variable: '--font-haffer',
// });

export const metadata: Metadata = {
  title: "Dubai Blueprint",
  description: "Building the Future of Digital Excellence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
