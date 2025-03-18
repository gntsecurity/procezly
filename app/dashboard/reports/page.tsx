"use client";

import { FileText } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <FileText className="h-6 w-6 text-blue-600" />
        Reports
      </h2>
      <div className="mt-4 bg-white shadow rounded-lg p-4">
        <p className="text-gray-600">Report generation and analytics will be integrated soon.</p>
      </div>
    </div>
  );
}
