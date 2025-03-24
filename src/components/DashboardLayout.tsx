"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className={`flex-1 transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"} p-6`}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
