// src/app/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CookieBanner from "../components/CookieBanner";
import "./globals.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isDashboardPage = pathname.startsWith("/dashboard");

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(() => {
        console.log("Service Worker Registered");
      });
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && isDashboardPage) {
        router.push("/login");
      }
      setLoading(false);
    };

    checkAuth();
  }, [router, pathname, isDashboardPage]);

  useEffect(() => {
    const handleResize = () => {
      const isSmall = window.matchMedia("(max-width: 768px)").matches;
      setIsMobile(isSmall);
      setCollapsed(isSmall); // auto-collapse sidebar on mobile
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-gray-600">Loading...</div>;
  }

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a2540" />
      </head>
      <body className="bg-white text-gray-900">
        <div className="flex min-h-screen w-full relative">
          {isDashboardPage && (
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          )}

          <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${isDashboardPage ? (collapsed ? "ml-16" : "ml-64") : ""}`}>
            {!isDashboardPage && !isMobile && <Navbar />}
            <main className="flex-1">{children}</main>
            {!isDashboardPage && <Footer />}
            <CookieBanner />
          </div>

          {/* Floating toggle button for sidebar on mobile */}
          {isDashboardPage && isMobile && (
            <button
              className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition"
              onClick={() => setCollapsed(!collapsed)}
              aria-label="Toggle Menu"
            >
              {collapsed ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          )}
        </div>
      </body>
    </html>
  );
}
