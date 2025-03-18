"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "/lib/supabase";
import DashboardCard from "../../components/ui/DashboardCard";
import AuditTable from "../../components/ui/AuditTable";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [orgName, setOrgName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [auditCount, setAuditCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [reportsGenerated, setReportsGenerated] = useState(0);
  const [complianceRate, setComplianceRate] = useState("0%");

  useEffect(() => {
    const fetchData = async () => {
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        router.push("/auth/signin");
        return;
      }

      const userId = user.user.id;
      setUserName(user.user.email);

      // Check organization membership
      const { data: userOrg, error: orgError } = await supabase
        .from("user_organizations")
        .select("organization_id, role")
        .eq("user_id", userId)
        .single();

      if (orgError || !userOrg) {
        router.push("/auth/company-setup");
        return;
      }

      setUserRole(userOrg.role);

      // Fetch organization name
      const { data: org, error: orgError2 } = await supabase
        .from("organizations")
        .select("name")
        .eq("id", userOrg.organization_id)
        .single();

      setOrgName(orgError2 ? "Unknown Organization" : org.name);

      // Fetch audit stats
      const { data: audits, error: auditError } = await supabase
        .from("audits")
        .select("id")
        .eq("organization_id", userOrg.organization_id);

      setAuditCount(audits ? audits.length : 0);

      // Fetch active users
      const { data: users, error: userCountError } = await supabase
        .from("user_organizations")
        .select("user_id")
        .eq("organization_id", userOrg.organization_id);

      setActiveUsers(users ? users.length : 0);

      // Fetch reports generated (if applicable)
      const { data: reports, error: reportsError } = await supabase
        .from("reports")
        .select("id")
        .eq("organization_id", userOrg.organization_id);

      setReportsGenerated(reports ? reports.length : 0);

      // Calculate compliance rate (Placeholder logic)
      setComplianceRate(audits && audits.length > 0 ? "80%" : "0%");

      setLoading(false);
    };

    fetchData();
  }, [router]);

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Loading...</p>;
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-black">
          Welcome, {userName}!
        </h1>
        {userRole && (
          <span className={`px-4 py-2 text-white text-sm font-semibold rounded-full ${
            userRole === "admin" ? "bg-blue-600" : "bg-gray-500"
          }`}>
            {userRole.toUpperCase()}
          </span>
        )}
      </div>

      <p className="text-lg text-gray-700">Organization: <strong>{orgName}</strong></p>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardCard title="Total Audits" value={auditCount} icon="file-text" />
        <DashboardCard title="Compliance Rate" value={complianceRate} icon="shield-check" />
        <DashboardCard title="Active Users" value={activeUsers} icon="users" />
        <DashboardCard title="Reports Generated" value={reportsGenerated} icon="bar-chart" />
      </div>

      {/* Recent Audits Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-black mb-4">Recent Audits</h2>
        <AuditTable />
      </div>
    </div>
  );
}
