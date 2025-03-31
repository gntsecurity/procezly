"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { Loader } from "lucide-react";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id) return;

      const { data: roleData } = await supabase
        .from("roles")
        .select("role, organization_id")
        .eq("user_id", user.id)
        .single();

      if (!roleData) return;

      setIsAdmin(roleData.role === "admin");

      const { data } = await supabase
        .from("submissions")
        .select("*")
        .eq("organization_id", roleData.organization_id)
        .order("created_at", { ascending: false });

      setSubmissions(data || []);
      setLoading(false);
    };

    fetchSubmissions();
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        <Loader className="animate-spin mr-2" />
        Loading...
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 sm:px-6 w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Audit Submissions</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        {submissions.length === 0 ? (
          <p className="text-gray-600 text-sm">No submissions found yet.</p>
        ) : (
          <ul className="divide-y">
            {submissions.map((s) => (
              <li key={s.id} className="py-3">
                <div className="text-sm font-medium text-gray-800">{s.uid}</div>
                <div className="text-xs text-gray-500">
                  {new Date(s.created_at).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
