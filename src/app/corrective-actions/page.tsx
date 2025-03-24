"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function CorrectiveActions() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const correctiveActions = [
    { id: 1, name: "Equipment Maintenance Update", status: "Completed" },
    { id: 2, name: "Safety Training Revision", status: "In Progress" },
    { id: 3, name: "Process Optimization Review", status: "Pending" },
  ];

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Corrective Actions</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search actions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Actions List */}
      <div className="space-y-4">
        {correctiveActions
          .filter((action) => action.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((action) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-gray-100 rounded-lg shadow flex justify-between"
            >
              <p className="text-gray-800">{action.name}</p>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-lg ${
                  action.status === "Completed"
                    ? "bg-green-500 text-white"
                    : action.status === "In Progress"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-400 text-white"
                }`}
              >
                {action.status}
              </span>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
