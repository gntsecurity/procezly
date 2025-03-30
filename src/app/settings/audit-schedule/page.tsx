"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../utils/supabaseClient";

const AuditSchedulePage = () => {
  const [orgId, setOrgId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    frequency: "weekly",
    day_of_week: "Monday",
    time_of_day: "08:00",
    timezone: "America/New_York",
    is_active: true,
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
        .from("audit_schedule_settings")
        .select("*")
        .eq("organization_id", roleData.organization_id)
        .single();

      if (existing) {
        setForm({
          frequency: existing.frequency,
          day_of_week: existing.day_of_week || "Monday",
          time_of_day: existing.time_of_day,
          timezone: existing.timezone || "America/New_York",
          is_active: existing.is_active,
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
      organization_id: orgId,
    };

    const { error } = await supabase
      .from("audit_schedule_settings")
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

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Audit Schedule Settings</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <label className="block">
          <span className="block mb-1 text-sm text-gray-700">Frequency</span>
          <select
            className="w-full border px-3 py-2 rounded"
            value={form.frequency}
            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>

        {form.frequency === "weekly" && (
          <label className="block">
            <span className="block mb-1 text-sm text-gray-700">Day of Week</span>
            <select
              className="w-full border px-3 py-2 rounded"
              value={form.day_of_week}
              onChange={(e) => setForm({ ...form, day_of_week: e.target.value })}
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
            </select>
          </label>
        )}

        <label className="block">
          <span className="block mb-1 text-sm text-gray-700">Time of Day</span>
          <input
            type="time"
            className="w-full border px-3 py-2 rounded"
            value={form.time_of_day}
            onChange={(e) => setForm({ ...form, time_of_day: e.target.value })}
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

        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          />
          <span className="text-sm text-gray-700">Enable schedule</span>
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

export default AuditSchedulePage;
