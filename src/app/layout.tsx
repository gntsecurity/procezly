"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/Sidebar";
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

  // ✅ Register Service Worker for PWA
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(() => {
        console.log("Service Worker Registered");
      });
    }
  }, []);

  // ✅ Only show the sidebar for dashboard-related pages
  const isDashboardPage = [
    "/dashboard",
    "/audits",
    "/reports",
    "/history",
    "/corrective-actions",
    "/compliance",
    "/templates",
    "/ai-insights",
    "/users",
    "/organizations",
    "/workflows",
    "/integrations",
    "/security",
    "/settings",
  ].some((path) => pathname.startsWith(path));

  // ✅ Authentication check
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

  // ✅ Show loading screen while checking authentication
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
      <body className="min-h-screen flex">
        {/* ✅ Sidebar renders ONLY ONCE for dashboard pages */}
        {isDashboardPage && <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />}

        {/* ✅ Dashboard pages DO NOT have Navbar/Footer */}
        <div className={`flex-1 flex flex-col transition-all ${isDashboardPage ? (collapsed ? "ml-16" : "ml-64") : ""}`}>
          {children} {/* ✅ Directly render page content */}
        </div>
      </body>
    </html>
  );
}
