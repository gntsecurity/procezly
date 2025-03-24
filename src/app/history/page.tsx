"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { ClipboardList, Search, Filter } from "lucide-react";

const AuditHistory = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Fetch audit history from Supabase
  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase.from("audit_history").select("*");
      if (error) console.error("Error fetching audit history:", error);
      else setHistory(data || []);
    };
    fetchHistory();
  }, []);

  // Filter & Search Logic
  const filteredHistory = history.filter((audit) =>
    (filterStatus === "All" || audit.status === filterStatus) &&
    audit.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-900">Audit History</h1>
      <p className="text-gray-600 mt-2">Review past audits and compliance records.</p>

      {/* Controls: Search & Filters */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search audit history..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Audits</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* History List */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Audit History Log</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Title</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Date</th>
              <th className="text-left px-4 py-2">Auditor</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((audit) => (
              <tr key={audit.id} className="border-t">
                <td className="px-4 py-2">{audit.id}</td>
                <td className="px-4 py-2">{audit.title}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                      audit.status === "Completed" ? "bg-green-100 text-green-700" :
                      "bg-red-100 text-red-700"
                    }`}
                  >
                    {audit.status}
                  </span>
                </td>
                <td className="px-4 py-2">{audit.date}</td>
                <td className="px-4 py-2">{audit.auditor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditHistory;
