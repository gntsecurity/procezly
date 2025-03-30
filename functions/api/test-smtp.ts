import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { host, port, username, password, from_email, secure } = req.body

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: username && password ? { user: username, pass: password } : undefined,
      tls: { rejectUnauthorized: false },
    })

    await transporter.sendMail({
      from: from_email,
      to: from_email,
      subject: 'SMTP Test',
      text: 'This is a test email from Procezly SMTP configuration.',
    })

    return res.status(200).json({ success: true })
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Unknown error' })
  }
}
