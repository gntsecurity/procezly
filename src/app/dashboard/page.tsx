// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import {
  ClipboardList,
  ShieldCheck,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalAudits: 0,
    ongoingAudits: 0,
    completedAudits: 0,
    failedAudits: 0,
    complianceScore: 0,
    expiringCertifications: 0,
    activeUsers: 0,
    recentActivity: [],
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        window.location.href = "/login";
        return;
      }
      setIsAuthenticated(true);
    };

    const fetchData = async () => {
      try {
        const { data: audits } = await supabase.from("audits").select("*");
        const { data: users } = await supabase.from("users").select("*");

        const totalAudits = audits?.length || 0;
        const ongoingAudits = audits?.filter((a) => a.status === "Ongoing").length || 0;
        const completedAudits = audits?.filter((a) => a.status === "Completed").length || 0;
        const failedAudits = audits?.filter((a) => a.status === "Failed").length || 0;
        const complianceScore = 87;
        const expiringCertifications = 3;
        const activeUsers = users?.length || 0;

        setDashboardData({
          totalAudits,
          ongoingAudits,
          completedAudits,
          failedAudits,
          complianceScore,
          expiringCertifications,
          activeUsers,
          recentActivity: [],
        });
      } catch (error) {
        console.error("Error fetching Supabase data:", error);
      }
    };

    checkAuth();
    fetchData();
  }, []);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Dashboard</h1>
      <p className="text-gray-600 text-sm sm:text-base mt-1">
        Live compliance and audit performance tracking.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
        <StatCard icon={<ClipboardList size={26} />} title="Total Audits" value={dashboardData.totalAudits} />
        <StatCard icon={<Clock size={26} />} title="Ongoing Audits" value={dashboardData.ongoingAudits} />
        <StatCard icon={<CheckCircle size={26} className="text-green-600" />} title="Completed Audits" value={dashboardData.completedAudits} />
        <StatCard icon={<AlertTriangle size={26} className="text-red-600" />} title="Failed Audits" value={dashboardData.failedAudits} />
        <StatCard icon={<ShieldCheck size={26} className="text-blue-600" />} title="Compliance Score" value={`${dashboardData.complianceScore}%`} />
        <StatCard icon={<FileText size={26} className="text-yellow-600" />} title="Expiring Certifications" value={dashboardData.expiringCertifications} />
        <StatCard icon={<Users size={26} className="text-indigo-600" />} title="Active Users" value={dashboardData.activeUsers} />
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm flex items-center space-x-4 border border-gray-200 hover:shadow-md transition">
      <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-lg sm:text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;
