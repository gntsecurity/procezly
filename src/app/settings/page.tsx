"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const frequencies = ["daily", "weekly", "monthly"];

type ScheduleForm = {
  frequency: "daily" | "weekly" | "monthly";
  day_of_week?: string;
  time_of_day: string;
  timezone: string;
  is_active: boolean;
};

export default function AuditSchedulePage() {
  const [orgId, setOrgId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<ScheduleForm>({
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

    if (error) {
      console.error("Save failed:", error.message);
    }

    setSaving(false);
  };

  if (!isAdmin) return null;

  return (
    <div className="px-4 pt-6 sm:px-6 w-full max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Audit Schedule Settings</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="w-full">
            <span className="block mb-1 text-sm text-gray-700">Frequency</span>
            <select
              className="w-full border px-3 py-2 rounded"
              value={form.frequency}
              onChange={(e) =>
                setForm({ ...form, frequency: e.target.value as ScheduleForm["frequency"] })
              }
            >
              {frequencies.map((f) => (
                <option key={f} value={f}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </option>
              ))}
            </select>
          </label>

          {form.frequency === "weekly" && (
            <label className="w-full">
              <span className="block mb-1 text-sm text-gray-700">Day of Week</span>
              <select
                className="w-full border px-3 py-2 rounded"
                value={form.day_of_week}
                onChange={(e) => setForm({ ...form, day_of_week: e.target.value })}
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

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
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
