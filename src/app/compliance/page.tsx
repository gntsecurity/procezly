"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Compliance() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const complianceStandards = [
    { id: 1, category: "ISO", name: "ISO 9001: Quality Management" },
    { id: 2, category: "Safety", name: "OSHA Workplace Safety Standards" },
    { id: 3, category: "Environmental", name: "EPA Environmental Regulations" },
  ];

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Compliance Standards</h1>

      {/* Filter Section */}
      <div className="flex space-x-4 mb-6">
        {["ISO", "Safety", "Environmental"].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 text-sm font-semibold border rounded-lg transition ${
              selectedCategory === category ? "bg-blue-600 text-white" : "border-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
        <button
          onClick={() => setSelectedCategory(null)}
          className="px-4 py-2 text-sm font-semibold border rounded-lg border-gray-300"
        >
          Reset
        </button>
      </div>

      {/* Compliance List */}
      <div className="space-y-4">
        {complianceStandards
          .filter((standard) => !selectedCategory || standard.category === selectedCategory)
          .map((standard) => (
            <motion.div
              key={standard.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-gray-100 rounded-lg shadow"
            >
              <p className="text-gray-800">{standard.name}</p>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
