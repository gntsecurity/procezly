"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { Brain, Search, Filter, AlertTriangle } from "lucide-react";

const AIComplianceInsights = () => {
  const [insights, setInsights] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState("All");

  // Fetch AI-generated compliance insights from Supabase
  useEffect(() => {
    const fetchInsights = async () => {
      const { data, error } = await supabase.from("ai_compliance_insights").select("*");
      if (error) console.error("Error fetching AI insights:", error);
      else setInsights(data || []);
    };
    fetchInsights();
  }, []);

  // Filter & Search Logic
  const filteredInsights = insights.filter((insight) =>
    (filterRisk === "All" || insight.risk_level === filterRisk) &&
    insight.compliance_area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-900">AI Compliance Insights</h1>
      <p className="text-gray-600 mt-2">Leverage AI to predict compliance risks and improve audit performance.</p>

      {/* Controls: Search & Filters */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search AI insights..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
          >
            <option value="All">All Risk Levels</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>
        </div>
      </div>

      {/* AI Insights List */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">AI-Powered Compliance Predictions</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Compliance Area</th>
              <th className="text-left px-4 py-2">Risk Level</th>
              <th className="text-left px-4 py-2">Predicted Failure Rate</th>
              <th className="text-left px-4 py-2">Suggested Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInsights.map((insight) => (
              <tr key={insight.id} className="border-t">
                <td className="px-4 py-2">{insight.id}</td>
                <td className="px-4 py-2">{insight.compliance_area}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                      insight.risk_level === "High" ? "bg-red-100 text-red-700" :
                      insight.risk_level === "Medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}
                  >
                    {insight.risk_level}
                  </span>
                </td>
                <td className="px-4 py-2">{insight.failure_rate}%</td>
                <td className="px-4 py-2">{insight.suggested_action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AIComplianceInsights;
