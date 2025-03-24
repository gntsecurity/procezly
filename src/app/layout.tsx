"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/Sidebar";
import "./globals.css"; // ✅ Keep global styles

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  // Define which pages need the Sidebar (dashboard-related pages)
  const isDashboardPage = pathname.startsWith("/dashboard") || 
                          pathname.startsWith("/audits") ||
                          pathname.startsWith("/reports") ||
                          pathname.startsWith("/history") ||
                          pathname.startsWith("/corrective-actions") ||
                          pathname.startsWith("/compliance") ||
                          pathname.startsWith("/templates") ||
                          pathname.startsWith("/ai-insights") ||
                          pathname.startsWith("/users") ||
                          pathname.startsWith("/organizations") ||
                          pathname.startsWith("/workflows") ||
                          pathname.startsWith("/integrations") ||
                          pathname.startsWith("/security") ||
                          pathname.startsWith("/settings");

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        if (isDashboardPage) {
          router.push("/login");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [router, pathname, isDashboardPage]);

  // Show loading screen while checking authentication
  if (loading) {
    return <div className="h-screen flex items-center justify-center text-gray-600">Loading...</div>;
  }

  return (
    <html lang="en">
      <body className="min-h-screen flex">
        {/* ✅ Sidebar only appears on dashboard pages */}
        {isDashboardPage && <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />}

        {/* ✅ Remove Navbar & Footer from dashboard pages */}
        <div className={`flex-1 flex flex-col transition-all ${isDashboardPage ? (collapsed ? "ml-16" : "ml-64") : ""}`}>
          {!isDashboardPage && <main className="flex-1">{children}</main>}
          {isDashboardPage && children} {/* ✅ Directly render dashboard pages without Navbar/Footer */}
        </div>
      </body>
    </html>
  );
}
