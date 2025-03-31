import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.5";
import nodemailer from "npm:nodemailer";

serve(async (req) => {
  try {
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = Deno.env.toObject();
    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return new Response("Unauthorized", { status: 401 });

    const { data: role } = await supabase
      .from("roles")
      .select("role, organization_id")
      .eq("user_id", user.id)
      .single();

    if (!role || role.role !== "admin") {
      return new Response("Forbidden", { status: 403 });
    }

    const { data: smtp } = await supabase
      .from("smtp_settings")
      .select("*")
      .eq("organization_id", role.organization_id)
      .single();

    if (!smtp || !smtp.host || !smtp.from_email) {
      return new Response("Missing SMTP config", { status: 400 });
    }

    const { test = false, to = "test@procezly.com", subject, text, html } = await req.json();

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: smtp.username
        ? {
            user: smtp.username,
            pass: smtp.password,
          }
        : undefined,
    });

    const sendResult = await transporter.sendMail({
      from: smtp.from_email,
      to,
      subject: subject || (test ? "Test Email from Procezly" : "No Subject"),
      text: text || (test ? "This is a test email from the SMTP settings page." : ""),
      html: html || undefined,
    });

    return new Response(JSON.stringify({ success: true, id: sendResult.messageId }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("SMTP Error:", err);
    return new Response("Failed to send email", { status: 500 });
  }
});
