"use client";

import Sidebar from "../../components/ui/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area - Properly Adjusted */}
      <main className="flex-1 px-8 py-6">{children}</main>
    </div>
  );
}
