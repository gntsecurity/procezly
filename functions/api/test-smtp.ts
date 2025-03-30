export const onRequestPost: PagesFunction = async ({ request, env }) => {
  try {
    const body = await request.json()
    const {
      host,
      port,
      from_email,
      to_email,
      secure,
    } = body

    const apiKey = env.SMTP2GO_API_KEY

    const response = await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        to: [to_email],
        sender: from_email,
        subject: 'SMTP Connection Test',
        text_body: `SMTP test to ${host}:${port} (${secure ? 'secure' : 'non-secure'}) succeeded.`,
      }),
    })

    const result = await response.json()

    if (!response.ok || result.data?.succeeded === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: result.data?.error || 'Failed to send test email'
      }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true }))
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: 'Unexpected error' }), { status: 500 })
  }
}
