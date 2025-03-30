"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../utils/supabaseClient";

const NotificationSettingsPage = () => {
  const [orgId, setOrgId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    email_enabled: true,
    push_enabled: false,
    daily_digest: true,
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
        .from("notification_settings")
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
      .from("notification_settings")
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

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Notification Settings</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.email_enabled}
            onChange={(e) => setForm({ ...form, email_enabled: e.target.checked })}
          />
          <span className="text-sm text-gray-700">Enable Email Notifications</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.push_enabled}
            onChange={(e) => setForm({ ...form, push_enabled: e.target.checked })}
          />
          <span className="text-sm text-gray-700">Enable Push Notifications</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.daily_digest}
            onChange={(e) => setForm({ ...form, daily_digest: e.target.checked })}
          />
          <span className="text-sm text-gray-700">Send Daily Digest Summary</span>
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

export default NotificationSettingsPage;
