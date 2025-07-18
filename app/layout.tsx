import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Martian_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import { Instrument_Serif } from "next/font/google";
import { Archivo_Narrow } from "next/font/google";
import { DM_Mono } from "next/font/google"; 
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const archivoNarrow = Archivo_Narrow({
  variable: "--font-archivo-narrow",
  subsets: ["latin"],
  weight: ["400"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Waveroom",
  description: "Waveroo is a platform for creating and sharing playlists of songs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${martianMono.variable} ${inter.variable} ${instrumentSerif.variable} ${archivoNarrow.variable} ${dmMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster className="bg-background text-foreground"/>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
