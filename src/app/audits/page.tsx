"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Audits() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const audits = [
    { id: 1, name: "ISO 9001 Compliance Audit", status: "Completed" },
    { id: 2, name: "Safety Inspection", status: "In Progress" },
    { id: 3, name: "Environmental Impact Audit", status: "Pending" },
  ];

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Kamishibai Audits</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search audits..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Audit List */}
      <div className="space-y-4">
        {audits
          .filter((audit) => audit.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((audit) => (
            <motion.div
              key={audit.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-gray-100 rounded-lg shadow flex justify-between"
            >
              <p className="text-gray-800">{audit.name}</p>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-lg ${
                  audit.status === "Completed"
                    ? "bg-green-500 text-white"
                    : audit.status === "In Progress"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-400 text-white"
                }`}
              >
                {audit.status}
              </span>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
