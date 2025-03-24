"use client";

import { useState } from "react";

export default function Dashboard() {
  const [dataLoaded, setDataLoaded] = useState(false);

  return (
    <div className="main-content">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-8">Real-time compliance insights at a glance.</p>

      {/* Simulating data loading */}
      <button
        onClick={() => setDataLoaded(true)}
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md"
      >
        Load Data
      </button>

      {dataLoaded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div className="p-4 bg-white rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold">Compliance Audits</h3>
            <p className="text-gray-500">Track completed and pending audits.</p>
          </div>

          <div className="p-4 bg-white rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold">Security Checks</h3>
            <p className="text-gray-500">Monitor your security compliance.</p>
          </div>

          <div className="p-4 bg-white rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold">Alerts</h3>
            <p className="text-gray-500">Identify critical compliance risks.</p>
          </div>
        </div>
      )}
    </div>
  );
}
