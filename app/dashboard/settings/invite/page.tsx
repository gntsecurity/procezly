"use client";

import { useState } from "react";
import { supabase } from "/lib/supabase";

export default function InviteUser() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { data: user, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      setError("Authentication error.");
      return;
    }

    // Get the admin's organization
    const { data: org, error: orgError } = await supabase
      .from("user_organizations")
      .select("organization_id")
      .eq("user_id", user.user.id)
      .single();

    if (orgError || !org) {
      setError("You must belong to an organization to invite users.");
      return;
    }

    // Check if user already exists in authentication
    const { data: existingUser, error: userCheckError } = await supabase
      .from("auth.users")
      .select("id")
      .eq("email", email)
      .single();

    let invitedUserId = existingUser?.id;

    if (!existingUser) {
      // Create new user if they don't exist
      const { data: newUser, error: newUserError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: false, // They will confirm it later
      });

      if (newUserError) {
        setError("Failed to create new user.");
        return;
      }
      invitedUserId = newUser.user.id;
    }

    // Assign the invited user to the organization
    const { error: orgAssignError } = await supabase
      .from("user_organizations")
      .insert([{ user_id: invitedUserId, organization_id: org.organization_id, role }]);

    if (orgAssignError) {
      setError("Failed to assign user to organization.");
      return;
    }

    setSuccess("User invited successfully.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Invite User</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <form onSubmit={handleInvite} className="space-y-4">
          <input type="email" placeholder="User Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-lg text-gray-900 focus:ring focus:ring-blue-300" required />
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-3 border rounded-lg text-gray-900">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">Send Invite</button>
        </form>
      </div>
    </div>
  );
}
