export const onRequestPost: PagesFunction = async ({ request }) => {
  try {
    const body = await request.json()
    const { host, port, username, password, from_email, secure } = body

    const res = await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: 'api-419EF92F87354783B6469E4B6CB1AEFB',
        sender: from_email,
        to: [from_email],
        subject: 'SMTP Test Email',
        text_body: 'SMTP settings validated successfully.',
        smtp_server: host,
        smtp_port: port,
        smtp_username: username || undefined,
        smtp_password: password || undefined,
        secure,
      }),
    })

    const result = await res.json()

    if (!res.ok || !result.success) {
      return new Response(JSON.stringify({ success: false, error: result }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, error: e.message || 'Unknown error' }), {
      status: 500,
    })
  }
}
