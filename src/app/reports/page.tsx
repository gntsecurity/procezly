"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Reports() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const reports = [
    { id: 1, name: "Q1 Compliance Report", date: "2024-04-01" },
    { id: 2, name: "Annual Safety Audit", date: "2023-12-15" },
    { id: 3, name: "Environmental Impact Report", date: "2023-10-10" },
  ];

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Audit Reports</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search reports..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports
          .filter((report) => report.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-gray-100 rounded-lg shadow flex justify-between"
            >
              <p className="text-gray-800">{report.name}</p>
              <span className="text-gray-500">{report.date}</span>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
