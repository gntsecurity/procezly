"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Home, LogOut, Menu } from "lucide-react";
import SidebarLink from "./SidebarLink";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside
      className={`h-screen bg-white border-r shadow-md flex flex-col justify-between fixed top-0 left-0 z-40 transition-all ${
        collapsed ? "w-16" : "w-64"
      } md:w-72 md:static`}
    >
      <div>
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between">
          <span className={`text-2xl font-bold tracking-wide text-gray-800 ${collapsed ? "hidden" : "block"}`}>
            Procezly
          </span>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 bg-gray-100 rounded-md focus:outline-none"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-2 mt-4">
          <SidebarLink href="/dashboard" icon={<Home size={22} className="text-gray-800" />} label="Dashboard" />
          {/* Add more Sidebar Links here as needed */}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4">
        <button onClick={handleLogout} className="flex items-center text-red-600 hover:underline">
          <LogOut size={22} />
          <span className={`ml-3 ${collapsed ? "hidden" : "block"}`}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
