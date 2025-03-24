import { Resend } from 'resend';

const resend = new Resend('re_beuFz6Am_Gwq7Szc5LJwGKsxWSyesty43');

export const onRequestPost = async ({ request }: { request: Request }) => {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await resend.emails.send({
      from: 'Procezly <noreply@procezly.com>',
      to: email,
      subject: `✅ You're now subscribed to Procezly`,
      html: `
        <h2>Welcome to Procezly 🚀</h2>
        <p>Thanks for subscribing to our newsletter. You'll now receive the latest features, updates, and compliance insights directly from Procezly.</p>
        <p>If you have questions or need help, reach out at <a href="mailto:gsmith@gntsecurity.com">gsmith@gntsecurity.com</a></p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Subscription error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
