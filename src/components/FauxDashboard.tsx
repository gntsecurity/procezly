"use client";

import {
  ClipboardList,
  Clock,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

export default function FauxDashboard() {
  const stats = [
    { icon: ClipboardList, label: "Total Audits", value: 132 },
    { icon: Clock, label: "Ongoing Audits", value: 27 },
    { icon: CheckCircle, label: "Completed Audits", value: 91, color: "text-green-600" },
    { icon: AlertTriangle, label: "Failed Audits", value: 14, color: "text-red-600" },
    { icon: ShieldCheck, label: "Compliance Score", value: "92%", color: "text-blue-600" },
    { icon: FileText, label: "Expiring Certifications", value: 3, color: "text-yellow-600" },
    { icon: Users, label: "Active Users", value: 18, color: "text-indigo-600" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map(({ icon: Icon, label, value, color = "text-gray-800" }, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.04 }}
            className="flex items-center p-5 bg-white rounded-xl border shadow-sm hover:shadow-md transition-all"
          >
            <div className={`p-3 bg-gray-100 rounded-full mr-4`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
