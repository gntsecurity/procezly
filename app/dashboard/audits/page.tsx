"use client";

import { useEffect, useState } from "react";
import { supabase } from "/lib/supabase";
import { ClipboardList, Pencil, Trash } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function AuditsPage() {
  const [audits, setAudits] = useState([]);
  const [managers, setManagers] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  // Form State
  const [cardName, setCardName] = useState("");
  const [description, setDescription] = useState("");
  const [auditArea, setAuditArea] = useState("");
  const [managerId, setManagerId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      // Get logged-in user
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.user) {
        console.error("User not found");
        setLoading(false);
        return;
      }

      const userId = user.user.id;

      // Get organization ID
      const { data: userOrg, error: orgError } = await supabase
        .from("user_organizations")
        .select("organization_id, role")
        .eq("user_id", userId)
        .single();

      if (orgError || !userOrg) {
        console.error("Organization not found for user");
        setLoading(false);
        return;
      }

      setRole(userOrg.role);

      // Fetch all Kamishibai Cards
const { data: auditsData, error: auditError } = await supabase
  .from("kamishibai_cards")  // Now this table exists
  .select("*")
  .eq("organization_id", userOrg.organization_id);

      if (auditError) {
        console.error("Error fetching Kamishibai Cards:", auditError.message);
      } else {
        setAudits(auditsData);
      }

      // Fetch user IDs in the organization
      const { data: usersData, error: usersError } = await supabase
        .from("user_organizations")
        .select("user_id")
        .eq("organization_id", userOrg.organization_id);

      if (usersError || !usersData.length) {
        console.error("Error fetching users:", usersError?.message || "No users found in the org");
        setLoading(false);
        return;
      }

      // Get user details from users table
      const userIds = usersData.map((u) => u.user_id);

      const { data: userDetails, error: userDetailsError } = await supabase
        .from("users")
        .select("id, email")
        .in("id", userIds);

      if (userDetailsError) {
        console.error("Error fetching user details:", userDetailsError.message);
        setLoading(false);
        return;
      }

      // Set managers for the dropdown
      setManagers(userDetails);
      setLoading(false);
    };

    fetchData();
  }, []);

  const addCard = async () => {
    if (!cardName || !description || !auditArea || !managerId) return;

    const newCard = {
      id: uuidv4(),
      name: cardName,
      description,
      audit_area: auditArea,
      manager_id: managerId,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("kamishibai_cards")
      .insert([newCard])
      .select()
      .single();

    if (!error) setAudits([...audits, data]);

    setCardName("");
    setDescription("");
    setAuditArea("");
    setManagerId("");
  };

  const deleteCard = async (id: string) => {
    await supabase.from("kamishibai_cards").delete().eq("id", id);
    setAudits(audits.filter((audit) => audit.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <ClipboardList className="h-6 w-6 text-blue-600" />
        Kamishibai Cards
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="mt-4 bg-white shadow rounded-lg p-4">
          {role === "admin" && (
            <div className="mb-4 grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Card Name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="p-2 border rounded w-full"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="p-2 border rounded w-full"
                required
              />
              <input
                type="text"
                placeholder="Audit Area"
                value={auditArea}
                onChange={(e) => setAuditArea(e.target.value)}
                className="p-2 border rounded w-full"
                required
              />
              <select
                value={managerId}
                onChange={(e) => setManagerId(e.target.value)}
                className="p-2 border rounded w-full"
                required
              >
                <option value="">Select Manager</option>
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.email}
                  </option>
                ))}
              </select>
              <button
                onClick={addCard}
                className="col-span-2 px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add Kamishibai Card
              </button>
            </div>
          )}

          <table className="w-full border-collapse mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Card ID</th>
                <th className="p-2 text-left">Card Name</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Audit Area</th>
                <th className="p-2 text-left">Manager</th>
                {role === "admin" && <th className="p-2 text-left">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {audits.map((audit) => (
                <tr key={audit.id} className="border-t">
                  <td className="p-2">{audit.id}</td>
                  <td className="p-2">{audit.name}</td>
                  <td className="p-2">{audit.description}</td>
                  <td className="p-2">{audit.audit_area}</td>
                  <td className="p-2">{managers.find((m) => m.id === audit.manager_id)?.email || "Unknown"}</td>
                  {role === "admin" && (
                    <td className="p-2 flex gap-2">
                      <button className="text-blue-600 hover:underline">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => deleteCard(audit.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
