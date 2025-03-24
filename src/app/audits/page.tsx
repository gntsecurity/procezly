"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { PlusCircle, Search, Filter, ClipboardList } from "lucide-react";

const Audits = () => {
  // State for Supabase data
  const [audits, setAudits] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch audits from Supabase (Ready for backend connection)
  useEffect(() => {
    const fetchAudits = async () => {
      const { data, error } = await supabase.from("audits").select("*");
      if (error) console.error("Error fetching audits:", error);
      else setAudits(data || []);
    };
    fetchAudits();
  }, []);

  // Filter & Search Logic
  const filteredAudits = audits.filter((audit) =>
    (filterStatus === "All" || audit.status === filterStatus) &&
    audit.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-900">Kamishibai Audits</h1>
      <p className="text-gray-600 mt-2">Manage, assign, and track Kamishibai audits in real-time.</p>

      {/* Controls: Search & Filters */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search audits..."
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
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={() => setShowCreateModal(true)}
        >
          <PlusCircle size={20} />
          <span>Create Audit</span>
        </button>
      </div>

      {/* Audit List */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Audit List</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Title</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Assigned To</th>
              <th className="text-left px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredAudits.map((audit) => (
              <tr key={audit.id} className="border-t">
                <td className="px-4 py-2">{audit.id}</td>
                <td className="px-4 py-2">{audit.title}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                      audit.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                      audit.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                      "bg-green-100 text-green-700"
                    }`}
                  >
                    {audit.status}
                  </span>
                </td>
                <td className="px-4 py-2">{audit.assignedTo}</td>
                <td className="px-4 py-2">{audit.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Audit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold text-gray-900">Create New Audit</h3>
            <p className="text-gray-600 mt-2">Fill in the details below to create a new audit.</p>
            {/* Form Fields */}
            <input type="text" placeholder="Audit Title" className="w-full mt-4 px-4 py-2 border rounded-lg" />
            <select className="w-full mt-4 px-4 py-2 border rounded-lg">
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <button
              className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => setShowCreateModal(false)}
            >
              Create Audit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Audits;
