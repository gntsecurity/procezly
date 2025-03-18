"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://hlyaboewzzgshitpkwtn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Use a .env file for this
);

export default function AuditTable() {
  const [audits, setAudits] = useState<{ id: number; name: string; status: string; date: string }[]>([]);

  useEffect(() => {
    const fetchAudits = async () => {
      const { data, error } = await supabase.from("audits").select("*");
      if (!error) {
        setAudits(data);
      }
    };

    fetchAudits();
  }, []);

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b">
          <th className="text-left p-3">Audit Name</th>
          <th className="text-left p-3">Status</th>
          <th className="text-left p-3">Date</th>
        </tr>
      </thead>
      <tbody>
        {audits.length > 0 ? (
          audits.map((audit) => (
            <tr key={audit.id} className="border-b">
              <td className="p-3">{audit.name}</td>
              <td className="p-3">{audit.status}</td>
              <td className="p-3">{audit.date}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3} className="text-center p-3 text-gray-500">
              No audits found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
