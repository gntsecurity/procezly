"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "../utils/supabaseClient";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import CookieBanner from "../components/CookieBanner";
import InstallPrompt from "../components/InstallPrompt";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const dashboardRoutes = ["/dashboard", "/kamishibai", "/submissions", "/settings"];
  const isDashboardPage = dashboardRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
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
      setCollapsed(isSmall);
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
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="76x76" href="/icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-180x180.png" />
      </head>
      <body className="bg-white text-gray-900">
        <div className="flex min-h-screen w-full relative">
          {isDashboardPage && (
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          )}

          <div
            className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
              isDashboardPage && !isMobile ? (collapsed ? "ml-16" : "ml-64") : ""
            }`}
          >
            <main className="flex-1">{children}</main>
            {!isDashboardPage && <Footer />}
            <CookieBanner />
            <InstallPrompt />
          </div>
        </div>
      </body>
    </html>
  );
}
