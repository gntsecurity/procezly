"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function AIInsights() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const insights = [
    { id: 1, category: "Efficiency", text: "AI detected a 15% efficiency increase in audits." },
    { id: 2, category: "Risk", text: "Potential compliance risks flagged in the latest reports." },
    { id: 3, category: "Automation", text: "Workflow automation reduced manual entries by 40%." },
  ];

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">AI Compliance Insights</h1>

      {/* Filter Section */}
      <div className="flex space-x-4 mb-6">
        {["Efficiency", "Risk", "Automation"].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedFilter(category)}
            className={`px-4 py-2 text-sm font-semibold border rounded-lg transition ${
              selectedFilter === category ? "bg-blue-600 text-white" : "border-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
        <button
          onClick={() => setSelectedFilter(null)}
          className="px-4 py-2 text-sm font-semibold border rounded-lg border-gray-300"
        >
          Reset
        </button>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {insights
          .filter((insight) => !selectedFilter || insight.category === selectedFilter)
          .map((insight) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-gray-100 rounded-lg shadow"
            >
              <p className="text-gray-800">{insight.text}</p>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
