// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Imports Tailwind CSS base styles
import Navbar from "./components/Navbar"; // Your Navbar component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tour Booking App",
  description: "Book your next adventure!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gray-100 text-gray-800 flex flex-col min-h-screen`}
      >
        <Navbar />
        <main className="container mx-auto p-4 flex-grow">
          {/* The content of your pages will be rendered here */}
          {children}
        </main>
        <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
          © {new Date().getFullYear()} TourApp. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
