"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // ✅ Ensure all dashboard-related pages only show the sidebar
  const isDashboard = [
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
    "/settings"
  ].some((route) => pathname.startsWith(route));

  // ✅ Sidebar Collapse State (Ensures it works)
  const [collapsed, setCollapsed] = useState(false);

  return (
    <html lang="en">
      <body className="min-h-screen flex">
        {/* Show Sidebar for dashboard pages */}
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
