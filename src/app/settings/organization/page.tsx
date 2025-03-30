"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

    const payload = { ...form };

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
      <Link
        href="/settings"
        className="text-sm text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to Settings
      </Link>

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Organization Settings</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        {/* form fields as before */}
      </div>
    </div>
  );
};

export default OrganizationSettingsPage;
