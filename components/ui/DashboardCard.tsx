import { ReactNode } from "react";
import { FileText, ShieldCheck, Users, BarChart } from "lucide-react";

const iconMap: { [key: string]: ReactNode } = {
  "file-text": <FileText className="w-6 h-6 text-blue-600" />,
  "shield-check": <ShieldCheck className="w-6 h-6 text-green-600" />,
  "users": <Users className="w-6 h-6 text-purple-600" />,
  "bar-chart": <BarChart className="w-6 h-6 text-gray-600" />,
};

interface DashboardCardProps {
  title: string;
  value: string;
  icon: keyof typeof iconMap;
}

export default function DashboardCard({ title, value, icon }: DashboardCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4">
      {iconMap[icon] || <FileText className="w-6 h-6 text-gray-600" />} {/* Fallback icon */}
      <div>
        <p className="text-lg font-medium text-black">{title}</p>
        <p className="text-2xl font-bold text-black">{value}</p>
      </div>
    </div>
  );
}
