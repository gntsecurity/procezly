"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Home, LogOut, Menu } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [isMobile, setIsMobile] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-inner flex justify-around py-3 px-4">
        <a href="/dashboard" className="flex flex-col items-center text-sm text-gray-700 hover:text-blue-600">
          <Home size={22} />
          <span className="text-xs mt-1">Dashboard</span>
        </a>
        <button onClick={handleLogout} className="flex flex-col items-center text-sm text-red-600 hover:text-red-800">
          <LogOut size={22} />
          <span className="text-xs mt-1">Logout</span>
        </button>
      </nav>
    );
  }

  return (
    <aside
      className={`h-screen bg-white border-r shadow-md flex flex-col justify-between fixed top-0 left-0 z-40 transition-all ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div>
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between">
          <span className={`text-2xl font-bold text-gray-800 ${collapsed ? "hidden" : "block"}`}>
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
        <nav className="flex flex-col space-y-2 mt-4 px-2">
          <a href="/dashboard" className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100">
            <Home size={22} className="text-gray-800" />
            {!collapsed && <span>Dashboard</span>}
          </a>
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4">
        <button onClick={handleLogout} className="flex items-center text-red-600 hover:underline">
          <LogOut size={22} />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
