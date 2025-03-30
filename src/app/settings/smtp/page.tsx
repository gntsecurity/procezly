"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../utils/supabaseClient";

const SmtpSettingsPage = () => {
  const [orgId, setOrgId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    host: "",
    port: 587,
    username: "",
    password: "",
    from_email: "",
    secure: false,
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

      const { data: existing } = await supabase
        .from("smtp_settings")
        .select("*")
        .eq("organization_id", roleData.organization_id)
        .single();

      if (existing) setForm(existing);
    };

    init();
  }, []);

  const handleSave = async () => {
    if (!orgId) return;
    setSaving(true);

    const payload = {
      ...form,
      organization_id: orgId,
    };

    const { error } = await supabase
      .from("smtp_settings")
      .upsert(payload, { onConflict: "organization_id" });

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

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">SMTP Settings</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        {/* form fields truncated for brevity — same as previous version */}
      </div>
    </div>
  );
};

export default SmtpSettingsPage;
