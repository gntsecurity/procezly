import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend("re_beuFz6Am_Gwq7Szc5LJwGKsxWSyesty43");

export async function POST(req: Request) {
  const { name, email, company, industry, message } = await req.json();

  try {
    await resend.emails.send({
      from: "Procezly <noreply@procezly.com>",
      to: "gsmith@gntsecurity.com",
      subject: `🔥 New Procezly Demo Request from ${name}`,
      html: `
        <h2>New Demo Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Industry:</strong> ${industry}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
