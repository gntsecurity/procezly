"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import SidebarLink from "./SidebarLink";
import {
  Home, ClipboardList, FileText, LogOut, Menu, ChevronDown, ChevronUp
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const Sidebar = ({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (value: boolean) => void }) => {
  const [auditOpen, setAuditOpen] = useState(false);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 768);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      {isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="fixed top-4 left-4 bg-gray-200 p-3 rounded-lg shadow-md z-50 md:hidden"
        >
          <Menu size={24} />
        </button>
      )}

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
            <SidebarLink href="/dashboard" icon={<Home size={22} className="text-gray-800" />} label="Dashboard" collapsed={collapsed} />
            <button onClick={() => setAuditOpen(!auditOpen)} className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-md">
              <div className="flex items-center">
                <ClipboardList size={22} className="text-gray-800" />
                {!collapsed && <span className="ml-3 text-sm font-medium">Auditing</span>}
              </div>
              {!collapsed && (auditOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
            </button>
            {auditOpen && !collapsed && (
              <div className="ml-6 flex flex-col space-y-1">
                <SidebarLink href="/audits" icon={<ClipboardList size={20} className="text-gray-800" />} label="Kamishibai Audits" collapsed={collapsed} />
                <SidebarLink href="/reports" icon={<FileText size={20} className="text-gray-800" />} label="Audit Reports" collapsed={collapsed} />
              </div>
            )}
          </nav>
        </div>

        <div className="p-4">
          <button onClick={handleLogout} className="flex items-center text-red-600 hover:underline">
            <LogOut size={22} />
            {!collapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
