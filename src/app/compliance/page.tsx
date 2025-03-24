"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { ShieldCheck, Search, Filter } from "lucide-react";

const ISOStandards = () => {
  const [isoStandards, setISOStandards] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Fetch ISO compliance data from Supabase
  useEffect(() => {
    const fetchISOStandards = async () => {
      const { data, error } = await supabase.from("iso_compliance").select("*");
      if (error) console.error("Error fetching ISO standards compliance data:", error);
      else setISOStandards(data || []);
    };
    fetchISOStandards();
  }, []);

  // Filter & Search Logic
  const filteredStandards = isoStandards.filter((standard) =>
    (filterStatus === "All" || standard.status === filterStatus) &&
    standard.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-900">ISO Standards Compliance</h1>
      <p className="text-gray-600 mt-2">Track and manage compliance with ISO and industry standards.</p>

      {/* Controls: Search & Filters */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search ISO standards..."
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
            <option value="All">All Standards</option>
            <option value="Compliant">Compliant</option>
            <option value="Pending">Pending</option>
            <option value="Non-Compliant">Non-Compliant</option>
          </select>
        </div>
      </div>

      {/* ISO Compliance List */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">ISO Compliance Log</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Standard</th>
              <th className="text-left px-4 py-2">Compliance Status</th>
              <th className="text-left px-4 py-2">Last Audit Date</th>
              <th className="text-left px-4 py-2">Next Audit Due</th>
            </tr>
          </thead>
          <tbody>
            {filteredStandards.map((standard) => (
              <tr key={standard.id} className="border-t">
                <td className="px-4 py-2">{standard.id}</td>
                <td className="px-4 py-2">{standard.name}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                      standard.status === "Compliant" ? "bg-green-100 text-green-700" :
                      standard.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}
                  >
                    {standard.status}
                  </span>
                </td>
                <td className="px-4 py-2">{standard.last_audit_date}</td>
                <td className="px-4 py-2">{standard.next_audit_due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ISOStandards;
