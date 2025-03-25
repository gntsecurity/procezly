export const dynamic = "force-dynamic";

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET() {
  const now = new Date().toISOString().slice(11, 16); // HH:MM UTC

  if (now !== "13:00") {
    return Response.json({ message: "Not the scheduled time" });
  }

  const { data: users, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error("Supabase Error:", error);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }

  const emails = users?.users
    .filter((user) => user.email)
    .map((user) => user.email!) || [];

  const send = await resend.emails.send({
    from: "Procezly Audits <noreply@procezly.com>",
    to: emails,
    subject: "Kamishibai Audit Assigned",
    html: `<p>You have been assigned a Kamishibai Audit. Please log in to your dashboard.</p>`,
  });

  console.log("Emails sent:", send);

  return Response.json({ status: "Emails sent", details: send });
}
