"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./globals.css";

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

  // Define dashboard-related pages that require the sidebar
  const isDashboard = pathname.startsWith("/audits") ||
                      pathname.startsWith("/reports") || pathname.startsWith("/history") ||
                      pathname.startsWith("/corrective-actions") || pathname.startsWith("/compliance") ||
                      pathname.startsWith("/templates") || pathname.startsWith("/ai-insights") ||
                      pathname.startsWith("/users") || pathname.startsWith("/organizations") ||
                      pathname.startsWith("/workflows") || pathname.startsWith("/integrations") ||
                      pathname.startsWith("/security") || pathname.startsWith("/settings");

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        if (isDashboard) {
          router.push("/login");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [router, pathname, isDashboard]);

  // Show loading screen while checking authentication
  if (loading) {
    return <div className="h-screen flex items-center justify-center text-gray-600">Loading...</div>;
  }

  return (
    <html lang="en">
      <body className="min-h-screen flex">
        {/* Show Sidebar for all dashboard pages except the landing page */}
        {isDashboard && <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />}

        <div className={`flex-1 flex flex-col transition-all ${isDashboard ? (collapsed ? "ml-16" : "ml-64") : ""}`}>
          {/* Show Navbar & Footer only on Landing Page */}
          {!isDashboard && <Navbar />}
          <main className="flex-1">{children}</main>
          {!isDashboard && <Footer />}
        </div>
      </body>
    </html>
  );
}
