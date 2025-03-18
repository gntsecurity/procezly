"use client";

import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Settings</h1>

      {/* Invite Users Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Manage Users</h2>
        <p className="text-gray-600 mb-4">Invite new users to your organization.</p>
        <Link href="/dashboard/settings/invite">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
            Invite Users
          </button>
        </Link>
      </div>

      {/* Placeholder for Future Settings */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <p className="text-gray-700">More settings will be added soon.</p>
      </div>
    </div>
  );
}
