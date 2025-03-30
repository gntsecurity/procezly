"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { Download } from "lucide-react";

interface Submission {
  id: string;
  card_id: string;
  status: string;
  notes: string;
  user_id: string;
  submitted_at: string;
  organization_id: string;
}

const ExportPage = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id) return;

      const { data: roleData } = await supabase
        .from("roles")
        .select("organization_id")
        .eq("user_id", user.id)
        .single();

      if (!roleData) return;
      setOrgId(roleData.organization_id);

      const { data: submissionData } = await supabase
        .from("submissions")
        .select("*")
        .eq("organization_id", roleData.organization_id)
        .order("submitted_at", { ascending: false });

      setSubmissions(submissionData || []);
      setLoading(false);
    };

    init();
  }, []);

  const exportCSV = () => {
    if (submissions.length === 0) return;

    const headers = Object.keys(submissions[0]);
    const csvRows = [headers.join(",")];

    for (const row of submissions) {
      const values = headers.map((field) => {
        const val = (row as any)[field];
        return typeof val === "string" && val.includes(",")
          ? `"${val.replace(/"/g, '""')}"`
          : val;
      });
      csvRows.push(values.join(","));
    }

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "submissions.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    if (submissions.length === 0) return;

    const blob = new Blob([JSON.stringify(submissions, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "submissions.json";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="px-4 pt-6 sm:px-6 w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Export Data</h1>

      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-medium text-gray-800 mb-2">Submissions</h2>
          <div className="flex gap-4">
            <button
              onClick={exportCSV}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
            >
              <Download size={18} className="mr-2" />
              Export CSV
            </button>
            <button
              onClick={exportJSON}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 flex items-center"
            >
              <Download size={18} className="mr-2" />
              Export JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportPage;
