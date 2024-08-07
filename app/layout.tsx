import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import NavBar from '@/components/Navbar';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"], 
  weight: ['300', '400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: "AmazDeals",
  description: "Track Amazon from A-Z :)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.className}>
        <main className="max-w-10xl mx-auto">
          <NavBar />
          {children}
        </main>
      </body>
    </html>
  );
}
