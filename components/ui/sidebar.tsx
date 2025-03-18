"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Users, Settings, LogOut } from "lucide-react";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5 text-blue-600" /> },
  { name: "Audits", href: "/dashboard/audits", icon: <FileText className="h-5 w-5 text-green-600" /> },
  { name: "Users", href: "/dashboard/users", icon: <Users className="h-5 w-5 text-purple-600" /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-gray-100 shadow-md flex flex-col justify-between">
      {/* Sidebar Top */}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900">Procezly</h2>

        {/* Sidebar Links */}
        <nav className="mt-8">
          <ul className="space-y-2">
            {sidebarLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    pathname === link.href ? "bg-gray-200" : "hover:bg-gray-300"
                  }`}
                >
                  {link.icon}
                  <span className="text-gray-900 font-medium">{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Sidebar Bottom */}
      <div className="p-6 space-y-3">
        {/* Settings Link */}
        <Link
          href="/dashboard/settings"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
            pathname === "/dashboard/settings" ? "bg-gray-200" : "hover:bg-gray-300"
          }`}
        >
          <Settings className="h-5 w-5 text-gray-600" />
          <span className="text-gray-900 font-medium">Settings</span>
        </Link>

        {/* Logout Button (Placeholder for Supabase Auth) */}
        <button
          className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg transition hover:bg-red-100"
          onClick={() => console.log("Logout functionality to be added")}
        >
          <LogOut className="h-5 w-5 text-red-600" />
          <span className="text-red-600 font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
