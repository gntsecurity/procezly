"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import SidebarLink from "./SidebarLink";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: "🏠" },
  { name: "Audits", href: "/audits", icon: "📋" },
  { name: "Workflows", href: "/workflows", icon: "🔄" },
  { name: "Security", href: "/security", icon: "🔒" },
];

export default function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (value: boolean) => void }) {
  const router = useRouter();

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="p-4">
        <h1 className="text-xl font-bold">{collapsed ? "PZ" : "PROCEZLY"}</h1>
        <button onClick={() => setCollapsed(!collapsed)} className="mt-4 text-gray-600">
          {collapsed ? "➡" : "⬅"}
        </button>
        <nav className="mt-6 space-y-4">
          {sidebarItems.map((item) => (
            <SidebarLink key={item.href} href={item.href} icon={item.icon}>
              {item.name}
            </SidebarLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t mt-auto">
        <button
          className="flex items-center text-red-600 hover:text-red-800"
          onClick={() => router.push("/logout")}
        >
          <FiLogOut className="mr-2" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}
