export const dynamic = "force-dynamic";

import { Resend } from "resend";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const resendKey = process.env.RESEND_API_KEY!;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@procezly.com";

  if (!supabaseKey) {
    console.error("❌ Missing SUPABASE_SERVICE_ROLE_KEY");
    return Response.json({ error: "Missing Supabase key" }, { status: 500 });
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, supabaseKey);
  const resend = new Resend(resendKey);

  const now = new Date().toISOString().slice(11, 16); // HH:MM

  if (now !== "13:00") {
    return Response.json({ message: "Not the scheduled time" });
  }

  const { data: users, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error("Supabase Error:", error);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }

  const emails =
    users?.users.filter((user) => user.email).map((u) => u.email!) || [];

  const sent = await resend.emails.send({
    from: `Procezly Audits <${fromEmail}>`,
    to: emails,
    subject: "Kamishibai Audit Assigned",
    html: `<p>You have been assigned a Kamishibai Audit. Please log in to your dashboard.</p>`,
  });

  return Response.json({ success: true, sent });
}
