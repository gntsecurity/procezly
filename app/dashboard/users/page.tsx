"use client";

import { useEffect, useState } from "react";
import { User, Users } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Placeholder: Fetch user data from Supabase later
    setUsers([
      { id: 1, name: "John Doe", role: "Admin", email: "john@example.com" },
      { id: 2, name: "Jane Smith", role: "Manager", email: "jane@example.com" },
    ]);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <Users className="h-6 w-6 text-blue-600" />
        User Management
      </h2>
      <div className="mt-4 bg-white shadow rounded-lg p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
