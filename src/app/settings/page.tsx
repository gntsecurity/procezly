"use client";

import { useRouter } from "next/navigation";
import {
  Mail,
  Clock,
  Building,
  Bell,
} from "lucide-react";

const settings = [
  {
    title: "Audit Schedule",
    description: "Configure recurring audit email delivery.",
    icon: <Clock size={24} className="text-blue-600" />,
    path: "/settings/audit-schedule",
  },
  {
    title: "SMTP / Email",
    description: "Set up your organization's email provider.",
    icon: <Mail size={24} className="text-rose-600" />,
    path: "/settings/smtp",
  },
  {
    title: "Organization Info",
    description: "Manage your organization's profile and users.",
    icon: <Building size={24} className="text-indigo-600" />,
    path: "/settings/organization",
  },
  {
    title: "Notifications",
    description: "Manage system notifications and delivery.",
    icon: <Bell size={24} className="text-amber-600" />,
    path: "/settings/notifications",
  },
];

const SettingsPage = () => {
  const router = useRouter();

  return (
    <div className="px-4 pt-6 sm:px-6 w-full max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {settings.map((item) => (
          <button
            key={item.title}
            onClick={() => router.push(item.path)}
            className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm hover:shadow-md hover:scale-[1.01] transition text-left flex items-start gap-4"
          >
            <div className="p-2 bg-gray-100 rounded-full">{item.icon}</div>
            <div>
              <h2 className="text-lg font-medium text-gray-800">{item.title}</h2>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
