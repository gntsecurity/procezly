import { Resend } from 'resend';

const resend = new Resend('re_beuFz6Am_Gwq7Szc5LJwGKsxWSyesty43');

export const onRequestPost = async ({ request }: { request: Request }) => {
  try {
    const { name, email, company, industry, message } = await request.json();

    await resend.emails.send({
      from: 'Procezly <noreply@procezly.com>',
      to: 'gsmith@gntsecurity.com',
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

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Resend error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal Server Error' }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
};
