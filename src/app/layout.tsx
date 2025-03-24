"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // ✅ Dashboard Pages Check
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

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="min-h-screen flex flex-col">
        {/* ✅ Only show Navbar on non-dashboard pages */}
        {!isDashboardPage && <Navbar />}

        <div className="flex flex-1">
          {isDashboardPage && <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />}
          <main className={`flex-1 transition-all ${isDashboardPage ? (collapsed ? "ml-16" : "ml-64") : ""}`}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
