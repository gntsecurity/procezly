"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";

const OrganizationSettingsPage = () => {
  const [orgId, setOrgId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    timezone: "America/New_York",
  });

  useEffect(() => {
    const init = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) return;

      const { data: roleData } = await supabase
        .from("roles")
        .select("role, organization_id")
        .eq("user_id", user.user.id)
        .single();

      if (!roleData) return;
      setOrgId(roleData.organization_id);
      setIsAdmin(roleData.role === "admin");

      const { data: orgData } = await supabase
        .from("organizations")
        .select("name, timezone")
        .eq("id", roleData.organization_id)
        .single();

      if (orgData) {
        setForm({
          name: orgData.name || "",
          timezone: orgData.timezone || "America/New_York",
        });
      }
    };

    init();
  }, []);

  const handleSave = async () => {
    if (!orgId) return;
    setSaving(true);

    const payload = {
      ...form,
    };

    const { error } = await supabase
      .from("organizations")
      .update(payload)
      .eq("id", orgId);

    if (error) console.error(error);
    setSaving(false);
  };

  if (!isAdmin) return null;

  return (
    <div className="px-4 pt-6 sm:px-6 w-full max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Organization Settings</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <label className="block">
          <span className="block mb-1 text-sm text-gray-700">Organization Name</span>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>

        <label className="block">
          <span className="block mb-1 text-sm text-gray-700">Timezone</span>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={form.timezone}
            onChange={(e) => setForm({ ...form, timezone: e.target.value })}
          />
        </label>

        <div className="pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSettingsPage;
