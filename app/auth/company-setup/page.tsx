"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "/lib/supabase";

export default function CompanySetup() {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState("");

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setError("Authentication error. Please log in again.");
      return;
    }

    // Insert new organization with creator_id
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert([{ name: orgName, creator_id: user.id }]) // Ensure creator_id is set
      .select()
      .single();

    if (orgError) {
      setError(orgError.message);
      return;
    }

    // Link user to the organization as an admin
    const { error: linkError } = await supabase.from("user_organizations").insert([
      {
        user_id: user.id,
        organization_id: org.id,
        role: "admin",
      },
    ]);

    if (linkError) {
      setError(linkError.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Create Organization</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleCreateOrganization} className="space-y-4">
          <input
            type="text"
            placeholder="Organization Name"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="w-full p-3 border rounded-lg text-gray-900 focus:ring focus:ring-blue-300"
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Create Organization
          </button>
        </form>
      </div>
    </div>
  );
}
