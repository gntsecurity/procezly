"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { FileText, Download, Search } from "lucide-react";

const AuditReports = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Fetch audit reports from Supabase
  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase.from("audit_reports").select("*");
      if (error) console.error("Error fetching reports:", error);
      else setReports(data || []);
    };
    fetchReports();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-900">Audit Reports</h1>
      <p className="text-gray-600 mt-2">Review, analyze, and export audit reports.</p>

      {/* Controls: Search & Filters */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search reports..."
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
            <option value="All">All Reports</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Report List */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Audit Report List</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Title</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Date</th>
              <th className="text-left px-4 py-2">Export</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-t">
                <td className="px-4 py-2">{report.id}</td>
                <td className="px-4 py-2">{report.title}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                      report.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                      report.status === "Completed" ? "bg-green-100 text-green-700" :
                      "bg-red-100 text-red-700"
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="px-4 py-2">{report.date}</td>
                <td className="px-4 py-2">
                  <button className="flex items-center text-blue-600 hover:text-blue-800 transition">
                    <Download size={18} />
                    <span className="ml-2 text-sm">Export</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditReports;
