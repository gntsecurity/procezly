"use client";

import { ClipboardCheck, FileCheck, Workflow, ShieldCheck, BarChart3, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function FauxDashboard() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={`relative flex ${isMobile ? "flex-col" : "flex-row"} h-auto w-full max-w-5xl rounded-xl shadow-lg overflow-hidden border border-gray-200 bg-white mx-auto`}
    >
      {/* Faux Sidebar */}
      <div className="w-full md:w-56 bg-gray-100 border-r p-4 flex flex-col">
        <h2 className="font-bold text-gray-700 mb-4">Dashboard</h2>
        <ul className="space-y-4 text-sm">
          <li className="flex items-center space-x-2 text-gray-600 font-semibold">
            <FileCheck className="w-5 h-5 text-blue-600" />
            <span>Audits</span>
          </li>
          <li className="flex items-center space-x-2 text-gray-600 font-semibold">
            <Workflow className="w-5 h-5 text-blue-600" />
            <span>Workflows</span>
          </li>
          <li className="flex items-center space-x-2 text-gray-600 font-semibold">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>Security</span>
          </li>
        </ul>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 p-6">
        <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500">Live compliance and audit tracking.</p>

        <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-3"} gap-6 mt-4`}>
          {[
            { icon: ClipboardCheck, label: "Total Audits", value: "0" },
            { icon: Eye, label: "Ongoing Audits", value: "0" },
            { icon: FileCheck, label: "Completed Audits", value: "0" },
            { icon: ShieldCheck, label: "Compliance Score", value: "87%" },
            { icon: BarChart3, label: "Expiring Certifications", value: "3" },
            { icon: Workflow, label: "Active Users", value: "0" },
          ].map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gray-50 rounded-lg shadow-md flex flex-col items-center text-center"
            >
              <Icon className="h-6 w-6 text-blue-600" />
              <p className="text-gray-700 font-semibold mt-2">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
