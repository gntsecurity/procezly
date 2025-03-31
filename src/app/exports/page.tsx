"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { Download } from "lucide-react";

export default function ExportPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [submissions, setSubmissions] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [orgId, setOrgId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: roleData } = await supabase
        .from("roles")
        .select("organization_id")
        .eq("user_id", user.id)
        .single();

      if (!roleData) return;

      setOrgId(roleData.organization_id);

      const { data } = await supabase
        .from("submissions")
        .select("*")
        .eq("organization_id", roleData.organization_id);

      setSubmissions(data || []);
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="px-4 pt-6 sm:px-6 w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Export Submissions</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        {submissions.length === 0 ? (
          <p className="text-gray-600 text-sm">No submissions available yet.</p>
        ) : (
          <ul className="divide-y">
            {submissions.map((s) => (
              <li key={s.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{s.uid}</p>
                  <p className="text-xs text-gray-500">{new Date(s.created_at).toLocaleString()}</p>
                </div>
                <Download className="text-gray-500" size={18} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
