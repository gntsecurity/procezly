"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { ClipboardList, ShieldCheck, Users, AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react";

const Dashboard = () => {
  // State to hold Supabase data
  const [dashboardData, setDashboardData] = useState({
    totalAudits: 0,
    ongoingAudits: 0,
    completedAudits: 0,
    failedAudits: 0,
    complianceScore: 0,
    expiringCertifications: 0,
    activeUsers: 0,
    recentActivity: []
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch Data from Supabase
  useEffect(() => {
    const checkAuth = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        window.location.href = "/login"; // Redirect to login if unauthenticated
        return;
      }
      setIsAuthenticated(true);
    };

    const fetchData = async () => {
      try {
        const { data: audits } = await supabase.from("audits").select("*");
        const { data: users } = await supabase.from("users").select("*");

        // Process audit data
        const totalAudits = audits?.length || 0;
        const ongoingAudits = audits?.filter(a => a.status === "Ongoing").length || 0;
        const completedAudits = audits?.filter(a => a.status === "Completed").length || 0;
        const failedAudits = audits?.filter(a => a.status === "Failed").length || 0;
        const complianceScore = 87; // Placeholder until calculation is implemented
        const expiringCertifications = 3; // Placeholder
        const activeUsers = users?.length || 0;

        setDashboardData({
          totalAudits,
          ongoingAudits,
          completedAudits,
          failedAudits,
          complianceScore,
          expiringCertifications,
          activeUsers,
          recentActivity: []
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
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
      <p className="text-gray-600 mt-2">Live compliance and audit performance tracking.</p>

      {/* Key Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <StatCard icon={<ClipboardList size={28} />} title="Total Audits" value={dashboardData.totalAudits} />
        <StatCard icon={<Clock size={28} />} title="Ongoing Audits" value={dashboardData.ongoingAudits} />
        <StatCard icon={<CheckCircle size={28} className="text-green-600" />} title="Completed Audits" value={dashboardData.completedAudits} />
        <StatCard icon={<AlertTriangle size={28} className="text-red-600" />} title="Failed Audits" value={dashboardData.failedAudits} />
        <StatCard icon={<ShieldCheck size={28} className="text-blue-600" />} title="Compliance Score" value={`${dashboardData.complianceScore}%`} />
        <StatCard icon={<FileText size={28} className="text-yellow-600" />} title="Expiring Certifications" value={dashboardData.expiringCertifications} />
        <StatCard icon={<Users size={28} className="text-indigo-600" />} title="Active Users" value={dashboardData.activeUsers} />
      </div>
    </div>
  );
};

// Component for Statistic Cards
const StatCard = ({ icon, title, value }: { icon: React.ReactNode; title: string; value: string | number }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 border border-gray-200 hover:shadow-lg transition">
      <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;
