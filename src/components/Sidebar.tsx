"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import {
  Home, ClipboardList, FileText, AlertTriangle, Users, Settings, LogOut, Menu,
  ShieldCheck, Building, Brain, Workflow, Plug, Lock, ChevronDown, ChevronUp
} from "lucide-react";
import SidebarLink from "./SidebarLink";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const Sidebar = ({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (value: boolean) => void }) => {
  const [auditOpen, setAuditOpen] = useState(false);
  const [complianceOpen, setComplianceOpen] = useState(false);
  const [managementOpen, setManagementOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className={`h-screen bg-white border-r shadow-md flex flex-col justify-between transition-all ${collapsed ? "w-16" : "w-72"}`}>
      <div>
        {/* Branding */}
        <div className="p-4 flex items-center justify-between">
          <span className={`text-2xl font-bold uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#0a2540] to-[#2d79c7] transition-all ${collapsed ? "hidden" : "block"}`}>
            Procezly
          </span>
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 focus:outline-none">
            <Menu size={24} className="text-[#222222]" />
          </button>
        </div>

        {/* Core Sections */}
        <nav className="flex flex-col space-y-2 mt-4">
          <SidebarLink href="/dashboard" icon={<Home size={22} className="text-[#222222]" />} label="Dashboard" collapsed={collapsed} />

          {/* Auditing Dropdown */}
          <button onClick={() => setAuditOpen(!auditOpen)} className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-md">
            <div className="flex items-center">
              <ClipboardList size={22} className="text-[#222222]" />
              {!collapsed && <span className="ml-3 text-sm font-medium">Auditing</span>}
            </div>
            {!collapsed && (auditOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
          </button>
          {auditOpen && !collapsed && (
            <div className="ml-6 flex flex-col space-y-1">
              <SidebarLink href="/audits" icon={<ClipboardList size={20} className="text-[#222222]" />} label="Kamishibai Audits" collapsed={collapsed} />
              <SidebarLink href="/reports" icon={<FileText size={20} className="text-[#222222]" />} label="Audit Reports" collapsed={collapsed} />
              <SidebarLink href="/history" icon={<ClipboardList size={20} className="text-[#222222]" />} label="Audit History" collapsed={collapsed} />
              <SidebarLink href="/corrective-actions" icon={<AlertTriangle size={20} className="text-[#222222]" />} label="Corrective Actions" collapsed={collapsed} />
            </div>
          )}

          {/* Compliance Dropdown */}
          <button onClick={() => setComplianceOpen(!complianceOpen)} className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-md">
            <div className="flex items-center">
              <ShieldCheck size={22} className="text-[#222222]" />
              {!collapsed && <span className="ml-3 text-sm font-medium">Compliance</span>}
            </div>
            {!collapsed && (complianceOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
          </button>
          {complianceOpen && !collapsed && (
            <div className="ml-6 flex flex-col space-y-1">
              <SidebarLink href="/compliance" icon={<ShieldCheck size={20} className="text-[#222222]" />} label="ISO Standards" collapsed={collapsed} />
              <SidebarLink href="/templates" icon={<FileText size={20} className="text-[#222222]" />} label="Audit Templates" collapsed={collapsed} />
              <SidebarLink href="/ai-insights" icon={<Brain size={20} className="text-[#222222]" />} label="AI Compliance Insights" collapsed={collapsed} />
            </div>
          )}

          {/* User & Organization Management */}
          <button onClick={() => setManagementOpen(!managementOpen)} className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-md">
            <div className="flex items-center">
              <Users size={22} className="text-[#222222]" />
              {!collapsed && <span className="ml-3 text-sm font-medium">Management</span>}
            </div>
            {!collapsed && (managementOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
          </button>
          {managementOpen && !collapsed && (
            <div className="ml-6 flex flex-col space-y-1">
              <SidebarLink href="/users" icon={<Users size={20} className="text-[#222222]" />} label="Users" collapsed={collapsed} />
              <SidebarLink href="/organizations" icon={<Building size={20} className="text-[#222222]" />} label="Organizations" collapsed={collapsed} />
            </div>
          )}

          {/* Settings & Advanced Features */}
          <button onClick={() => setSettingsOpen(!settingsOpen)} className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-md">
            <div className="flex items-center">
              <Settings size={22} className="text-[#222222]" />
              {!collapsed && <span className="ml-3 text-sm font-medium">Settings</span>}
            </div>
            {!collapsed && (settingsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
          </button>
          {settingsOpen && !collapsed && (
            <div className="ml-6 flex flex-col space-y-1">
              <SidebarLink href="/workflows" icon={<Workflow size={20} className="text-[#222222]" />} label="Workflows" collapsed={collapsed} />
              <SidebarLink href="/integrations" icon={<Plug size={20} className="text-[#222222]" />} label="Integrations" collapsed={collapsed} />
              <SidebarLink href="/security" icon={<Lock size={20} className="text-[#222222]" />} label="Security & Access" collapsed={collapsed} />
            </div>
          )}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4">
        <button onClick={handleLogout} className="flex items-center text-red-600 hover:underline">
          <LogOut size={22} />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
