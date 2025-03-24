"use client";

import Link from "next/link";

const SidebarLink = ({
  href,
  icon,
  label,
  collapsed,
  isLogout,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  isLogout?: boolean;
}) => {
  return (
    <Link
      href={href}
      className={`flex items-center ${
        collapsed ? "justify-center" : "space-x-3"
      } p-3 rounded-md transition ${
        isLogout ? "text-red-500 hover:bg-red-100" : "hover:bg-gray-100"
      }`}
    >
      <div className="flex items-center justify-center w-8 h-8">{icon}</div>
      <span
        className={`text-sm font-medium transition-all ${
          collapsed ? "hidden" : "block"
        }`}
      >
        {label}
      </span>
    </Link>
  );
};

export default SidebarLink;
