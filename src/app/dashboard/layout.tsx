"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../../components/Sidebar"; // ✅ Correct import

// ✅ Supabase Client Setup
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: session, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Supabase Auth Error:", error);
        router.push("/login");
        return;
      }

      if (!session?.session) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="flex h-screen w-screen">
      {/* ✅ Sidebar renders only ONCE here */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* ✅ Dashboard content, with margin based on sidebar state */}
      <main className={`flex-1 transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"} p-6`}>
        {isAuthenticated ? children : <div className="text-center text-gray-500">Redirecting...</div>}
      </main>
    </div>
  );
};

export default DashboardLayout;
