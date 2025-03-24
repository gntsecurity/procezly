"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import SidebarLink from "./SidebarLink";
import { Home, LogOut, Menu } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed top-4 left-4 bg-gray-200 p-3 rounded-lg shadow-md z-50 md:hidden"
      >
        <Menu size={24} />
      </button>

      <div
        className={`h-screen bg-white border-r shadow-md flex flex-col justify-between fixed top-0 left-0 z-40 transition-all ${
          collapsed ? "-translate-x-full" : "translate-x-0"
        } md:w-72 w-64 md:static`}
      >
        <div>
          <div className="p-4 flex items-center justify-between">
            <span className="text-2xl font-bold uppercase tracking-wide text-gray-800">
              Procezly
            </span>
            <button onClick={() => setCollapsed(true)} className="md:hidden p-2 focus:outline-none">
              ✕
            </button>
          </div>

          <nav className="flex flex-col space-y-2 mt-4">
            <SidebarLink href="/dashboard" icon={<Home size={22} className="text-gray-800" />} label="Dashboard" />
          </nav>
        </div>

        <div className="p-4">
          <button onClick={handleLogout} className="flex items-center text-red-600 hover:underline">
            <LogOut size={22} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
