"use client";

import { usePathname } from "next/navigation";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {!isDashboard && <Navbar />}
        <main className="flex-1">{children}</main>
        {!isDashboard && <Footer />}
      </body>
    </html>
  );
}
