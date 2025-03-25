// supabase/functions/schedule-audits/index.ts

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (_req) => {
  const url = Deno.env.get("SUPABASE_URL")!;
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const now = new Date();
  const currentHour = now.toISOString().slice(11, 16); // HH:MM
  const currentDay = now.toLocaleString("en-US", { weekday: "long", timeZone: "UTC" });

  const res = await fetch(`${url}/rest/v1/audit_schedule_settings?is_active=eq.true&select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });

  const schedules = await res.json();

  for (const schedule of schedules) {
    const matchTime = schedule.time_of_day === currentHour;
    const matchDay = !schedule.day_of_week || schedule.day_of_week === currentDay;

    if (!matchTime || !matchDay) continue;

    // Get users
    const userRes = await fetch(
      `${url}/rest/v1/audit_schedule_users?organization_id=eq.${schedule.organization_id}&is_active=eq.true&select=user_id`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    const users = await userRes.json();
    if (users.length === 0) continue;

    const user = users[Math.floor(Math.random() * users.length)];

    // Get cards
    const cardRes = await fetch(
      `${url}/rest/v1/kamishibai_cards?organization_id=eq.${schedule.organization_id}&select=id`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    const cards = await cardRes.json();
    if (cards.length === 0) continue;

    const card = cards[Math.floor(Math.random() * cards.length)];

    // Create audit assignment
    const dueAt = new Date();
    dueAt.setDate(dueAt.getDate() + 2); // due in 2 days

    const insert = await fetch(`${url}/rest/v1/audit_assignments`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        organization_id: schedule.organization_id,
        card_id: card.id,
        user_id: user.user_id,
        due_at: dueAt.toISOString(),
      }),
    });

    const [assignment] = await insert.json();

    // Send email (will plug in Resend next step)
    console.log("✅ Assigned card", card.id, "to user", user.user_id, "due", dueAt.toISOString());
  }

  return new Response("Audit schedule check completed", { status: 200 });
});
