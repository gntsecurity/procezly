"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { AlertTriangle, Search, Filter, UserCheck } from "lucide-react";

const CorrectiveActions = () => {
  const [actions, setActions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Fetch corrective actions from Supabase
  useEffect(() => {
    const fetchActions = async () => {
      const { data, error } = await supabase.from("corrective_actions").select("*");
      if (error) console.error("Error fetching corrective actions:", error);
      else setActions(data || []);
    };
    fetchActions();
  }, []);

  // Filter & Search Logic
  const filteredActions = actions.filter((action) =>
    (filterStatus === "All" || action.status === filterStatus) &&
    action.auditTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-900">Corrective Actions</h1>
      <p className="text-gray-600 mt-2">Manage and track corrective actions for failed audits.</p>

      {/* Controls: Search & Filters */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search corrective actions..."
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
            <option value="All">All Actions</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Corrective Actions List */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Corrective Actions Log</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Audit Title</th>
              <th className="text-left px-4 py-2">Responsible Party</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredActions.map((action) => (
              <tr key={action.id} className="border-t">
                <td className="px-4 py-2">{action.id}</td>
                <td className="px-4 py-2">{action.auditTitle}</td>
                <td className="px-4 py-2 flex items-center space-x-2">
                  <UserCheck size={18} className="text-gray-500" />
                  <span>{action.responsibleParty}</span>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                      action.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                      action.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                      "bg-green-100 text-green-700"
                    }`}
                  >
                    {action.status}
                  </span>
                </td>
                <td className="px-4 py-2">{action.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CorrectiveActions;
