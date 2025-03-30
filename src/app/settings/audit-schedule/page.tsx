"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../utils/supabaseClient";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const frequencies = ["daily", "weekly", "monthly"];

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
        {/* ...form fields... */}
        {/* [Truncated to save space, already provided earlier] */}
      </div>
    </div>
  );
};

export default AuditSchedulePage;
