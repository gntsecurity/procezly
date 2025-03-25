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
    totalCards: 0,
    activeUsers: 0,
    complianceScore: 0,
  });

  const [userName, setUserName] = useState("");
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
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError) console.warn("User error:", userError);
      if (!user?.user?.id) return;

      setUserName(user.user.email?.split("@")[0] || "there");

      const { data: roleData } = await supabase
        .from("roles")
        .select("organization_id")
        .eq("user_id", user.user.id)
        .single();

      if (!roleData) return;

      const { data: cards } = await supabase
        .from("kamishibai_cards")
        .select("*")
        .eq("organization_id", roleData.organization_id);

      const { data: users } = await supabase
        .from("roles")
        .select("user_id")
        .eq("organization_id", roleData.organization_id);

      setDashboardData({
        totalCards: cards?.length || 0,
        activeUsers: users?.length || 0,
        complianceScore: 87,
      });
    };

    checkAuth();
    fetchData();
  }, []);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 pt-4 sm:px-6 sm:pt-6 w-full max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-3xl font-semibold text-gray-900">
        Hey {userName}, welcome back 👋
      </h1>
      <p className="text-gray-600 text-sm sm:text-base mt-1">
        Your team is making progress! Here's the latest snapshot.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6 mt-6">
        <StatCard icon={<ClipboardList size={24} />} title="Kamishibai Cards" value={dashboardData.totalCards} />
        <StatCard icon={<Users size={24} className="text-indigo-600" />} title="Active Users" value={dashboardData.activeUsers} />
        <StatCard icon={<ShieldCheck size={24} className="text-blue-600" />} title="Compliance Score" value={`${dashboardData.complianceScore}%`} />
      </div>

      <div className="hidden">
        <AlertTriangle />
        <CheckCircle />
        <Clock />
        <FileText />
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
    <div className="bg-white px-4 py-3 sm:p-6 rounded-lg shadow-sm flex items-center space-x-4 border border-gray-200 hover:shadow-md transition">
      <div className="p-2 sm:p-3 bg-gray-100 rounded-full">{icon}</div>
      <div className="flex flex-col justify-center">
        <p className="text-xs sm:text-sm text-gray-600">{title}</p>
        <p className="text-base sm:text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;
