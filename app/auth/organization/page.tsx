"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "/lib/supabase";

export default function OrganizationSelection() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrganizations() {
      let { data, error } = await supabase.from("organizations").select("*");
      if (error) console.error(error);
      else setOrganizations(data);
    }
    fetchOrganizations();
  }, []);

  const handleJoin = async () => {
    setError("");

    if (!selectedOrg) {
      setError("Please select an organization.");
      return;
    }

    const user = await supabase.auth.getUser();
    if (!user) {
      setError("You must be logged in.");
      return;
    }

    const { error } = await supabase.from("organization_users").insert([
      { user_id: user.data.user.id, organization_id: selectedOrg, role: "member" }
    ]);

    if (error) setError(error.message);
    else router.push("/dashboard");
  };

  const handleCreate = async () => {
    setError("");

    if (!orgName) {
      setError("Enter a valid organization name.");
      return;
    }

    const { data: existingOrg } = await supabase
      .from("organizations")
      .select("*")
      .eq("name", orgName)
      .single();

    if (existingOrg) {
      setError("This organization already exists. Please request an invite.");
      return;
    }

    const user = await supabase.auth.getUser();
    if (!user) {
      setError("You must be logged in.");
      return;
    }

    const { data, error } = await supabase
      .from("organizations")
      .insert([{ name: orgName }])
      .select()
      .single();

    if (error) {
      setError(error.message);
      return;
    }

    await supabase.from("organization_users").insert([
      { user_id: user.data.user.id, organization_id: data.id, role: "admin" }
    ]);

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-lg p-8 bg-gray-100 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900">Join or Create an Organization</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="space-y-4">
          <select
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="w-full p-3 border rounded-lg text-gray-900 focus:ring focus:ring-blue-300"
          >
            <option value="">Select an Existing Organization</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleJoin}
            className="w-full p-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Join Organization
          </button>
        </div>

        <div className="mt-6 border-t pt-6">
          <input
            type="text"
            placeholder="Enter Organization Name"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="w-full p-3 border rounded-lg text-gray-900 focus:ring focus:ring-blue-300"
          />
          <button
            onClick={handleCreate}
            className="w-full mt-4 p-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
          >
            Create Organization
          </button>
        </div>
      </div>
    </div>
  );
}
