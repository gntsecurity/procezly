"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabaseClient";
import {
  Home,
  LogOut,
  Menu,
  ClipboardList,
  CheckCircle,
  Settings,
  BarChart,
  Calendar,
  Download
} from "lucide-react";
import { useEffect, useState } from "react";

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
    const handleResize = () => setIsMobile(window.innerWidth < 768);
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
        <a href="/kamishibai" className="flex flex-col items-center text-sm text-gray-700 hover:text-blue-600">
          <ClipboardList size={22} />
          <span className="text-xs mt-1">Kamishibai</span>
        </a>
        <a href="/submissions" className="flex flex-col items-center text-sm text-gray-700 hover:text-blue-600">
          <CheckCircle size={22} />
          <span className="text-xs mt-1">Submissions</span>
        </a>
        <a href="/settings" className="flex flex-col items-center text-sm text-gray-700 hover:text-blue-600">
          <Settings size={22} />
          <span className="text-xs mt-1">Settings</span>
        </a>
        <button
          onClick={handleLogout}
          className="flex flex-col items-center text-sm text-red-600 hover:text-red-800"
        >
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
        <div className="p-4 flex items-center justify-between">
          <img
            src="/logo.png"
            alt="Procezly Logo"
            className={`h-8 w-auto ${collapsed ? "hidden" : "block"}`}
          />
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 bg-gray-100 rounded-md focus:outline-none"
          >
            <Menu size={24} />
          </button>
        </div>

        <nav className="flex flex-col space-y-2 mt-4 px-2">
          <a href="/dashboard" className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100">
            <Home size={22} className="text-gray-800" />
            {!collapsed && <span>Dashboard</span>}
          </a>
          <a href="/kamishibai" className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100">
            <ClipboardList size={22} className="text-gray-800" />
            {!collapsed && <span>Kamishibai</span>}
          </a>
          <a href="/submissions" className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100">
            <CheckCircle size={22} className="text-gray-800" />
            {!collapsed && <span>Submissions</span>}
          </a>
          <a href="/compliance" className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100">
            <BarChart size={22} className="text-gray-800" />
            {!collapsed && <span>Compliance</span>}
          </a>
          <a href="/scheduler" className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100">
            <Calendar size={22} className="text-gray-800" />
            {!collapsed && <span>Scheduler</span>}
          </a>
          <a href="/exports" className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100">
            <Download size={22} className="text-gray-800" />
            {!collapsed && <span>Export</span>}
          </a>
        </nav>
      </div>

      <div className="p-4 space-y-2">
        <a href="/settings" className="flex items-center text-gray-800 hover:underline">
          <Settings size={22} />
          {!collapsed && <span className="ml-3">Settings</span>}
        </a>
        <button onClick={handleLogout} className="flex items-center text-red-600 hover:underline">
          <LogOut size={22} />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
