"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function AuditHistory() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const historyRecords = [
    { id: 1, name: "ISO 9001 Audit - 2024", date: "2024-01-15" },
    { id: 2, name: "Safety Inspection - 2023", date: "2023-11-20" },
    { id: 3, name: "Environmental Compliance - 2023", date: "2023-09-05" },
  ];

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Audit History</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search history..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* History List */}
      <div className="space-y-4">
        {historyRecords
          .filter((record) => record.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((record) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-gray-100 rounded-lg shadow flex justify-between"
            >
              <p className="text-gray-800">{record.name}</p>
              <span className="text-gray-500">{record.date}</span>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
