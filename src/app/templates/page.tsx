"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Templates() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const templates = [
    { id: 1, name: "ISO 9001 Audit Template", category: "Compliance" },
    { id: 2, name: "Safety Inspection Checklist", category: "Safety" },
    { id: 3, name: "Environmental Assessment Form", category: "Environmental" },
  ];

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Audit Templates</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        {templates
          .filter((template) => template.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-gray-100 rounded-lg shadow flex justify-between"
            >
              <p className="text-gray-800">{template.name}</p>
              <span className="text-gray-500">{template.category}</span>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
