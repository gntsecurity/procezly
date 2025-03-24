"use client";

import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`h-screen bg-white shadow-md border-r transition-all ${collapsed ? "w-16" : "w-64"}`}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-2 text-gray-600 hover:bg-gray-200 rounded-md w-full text-left"
      >
        {collapsed ? "➕ Expand" : "➖ Collapse"}
      </button>

      <nav className="mt-4">
        <Link href="/dashboard">
          <div className="p-4 hover:bg-gray-200 cursor-pointer">Dashboard</div>
        </Link>
        <Link href="/audits">
          <div className="p-4 hover:bg-gray-200 cursor-pointer">Audits</div>
        </Link>
        <Link href="/reports">
          <div className="p-4 hover:bg-gray-200 cursor-pointer">Reports</div>
        </Link>
      </nav>
    </div>
  );
}
