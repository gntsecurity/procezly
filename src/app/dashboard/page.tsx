"use client";

import { useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import { ClipboardList, ShieldCheck, Users, AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react";

export default function Dashboard() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from("audits").select("*");
        if (error) throw error;
        console.log("Fetched audits:", data);
      } catch (error) {
        console.error("Error fetching Supabase data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 space-y-8">
      {/* Dashboard Header */}
      <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-lg text-gray-700">Real-time compliance insights at a glance.</p>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Compliance Audits */}
        <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
          <ClipboardList size={40} className="text-blue-600" />
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-900">Compliance Audits</h2>
            <p className="text-gray-600">Track completed and pending audits.</p>
          </div>
        </div>

        {/* Security Status */}
        <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
          <ShieldCheck size={40} className="text-green-600" />
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-900">Security Checks</h2>
            <p className="text-gray-600">Monitor your security compliance.</p>
          </div>
        </div>

        {/* Users & Access */}
        <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
          <Users size={40} className="text-purple-600" />
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-900">Users & Access</h2>
            <p className="text-gray-600">Manage roles and permissions.</p>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
          <AlertTriangle size={40} className="text-red-600" />
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-900">Alerts</h2>
            <p className="text-gray-600">Identify critical compliance risks.</p>
          </div>
        </div>

        {/* Compliance Status */}
        <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
          <CheckCircle size={40} className="text-blue-500" />
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-900">Compliance Status</h2>
            <p className="text-gray-600">Monitor real-time compliance levels.</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
          <Clock size={40} className="text-gray-600" />
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <p className="text-gray-600">View the latest compliance updates.</p>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
          <FileText size={28} className="text-indigo-600 mr-3" />
          Compliance Reports
        </h2>
        <p className="text-gray-700 mt-2">Generate and review compliance reports.</p>
        <button className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
          Generate Report
        </button>
      </div>
    </div>
  );
}
