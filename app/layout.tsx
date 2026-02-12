import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const pixelFont = Press_Start_2P({ 
  weight: '400',
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sui Agent OS - Pixel AI Agents",
  description: "Deploy pixel AI agents on Sui blockchain with retro gaming vibes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={pixelFont.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
