// src/app/api/assign-audits/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // must use Service Role for inserts
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  const now = new Date().toISOString().slice(11, 16); // HH:MM UTC
  const day = new Date().toLocaleString("en-US", { weekday: "long", timeZone: "UTC" });

  const { data: schedules, error } = await supabase
    .from("audit_schedule_settings")
    .select("*")
    .eq("is_active", true);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results = [];

  for (const schedule of schedules) {
    const timeMatch = schedule.time_of_day === now;
    const dayMatch = !schedule.day_of_week || schedule.day_of_week === day;

    if (!timeMatch || !dayMatch) continue;

    const { data: users } = await supabase
      .from("audit_schedule_users")
      .select("user_id")
      .eq("organization_id", schedule.organization_id)
      .eq("is_active", true);

    const { data: cards } = await supabase
      .from("kamishibai_cards")
      .select("id, uid, task")
      .eq("organization_id", schedule.organization_id);

    if (!users?.length || !cards?.length) continue;

    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomCard = cards[Math.floor(Math.random() * cards.length)];

    const due = new Date();
    due.setDate(due.getDate() + 2);

    const { data: assignment, error: insertErr } = await supabase
      .from("audit_assignments")
      .insert({
        user_id: randomUser.user_id,
        card_id: randomCard.id,
        organization_id: schedule.organization_id,
        due_at: due.toISOString(),
      })
      .select()
      .single();

    if (insertErr) {
      console.error(insertErr);
      continue;
    }

    const { data: userInfo } = await supabase
      .from("users")
      .select("email")
      .eq("id", randomUser.user_id)
      .single();

    if (userInfo?.email) {
      await resend.emails.send({
        from: "Procezly <audit@procezly.com>",
        to: userInfo.email,
        subject: `New Kamishibai Audit Assigned: ${randomCard.uid}`,
        html: `
          <p>Hello,</p>
          <p>You have been assigned a new Kamishibai audit.</p>
          <p><strong>Card:</strong> ${randomCard.uid}</p>
          <p><strong>Task:</strong> ${randomCard.task}</p>
          <p><strong>Due:</strong> ${due.toDateString()}</p>
          <p>
            <a href="https://procezly.com/audit/${assignment.id}" style="padding: 10px 16px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px;">
              Start Audit
            </a>
          </p>
        `,
      });
    }

    results.push({ user: randomUser.user_id, card: randomCard.uid });
  }

  return NextResponse.json({ success: true, results });
}
