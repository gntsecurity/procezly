import { Resend } from 'resend';

export interface Env {
  DB: D1Database;
  RESEND_API_KEY: string;
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    const db = env.DB;
    const resend = new Resend(env.RESEND_API_KEY);

    const now = new Date();
    const currentHour = now.toISOString().slice(11, 16); // "HH:MM"
    const currentDay = now.toLocaleString('en-US', { weekday: 'long', timeZone: 'UTC' });

    const query = `
      SELECT organization_id FROM audit_schedule_settings
      WHERE is_active = 1
        AND time_of_day = ?
        AND (day_of_week IS NULL OR day_of_week = ?)
    `;

    const result = await db.prepare(query).bind(currentHour, currentDay).all();

    for (const row of result.results) {
      const orgId = row.organization_id;

      await resend.emails.send({
        to: 'admin@example.com', // TODO: fetch real org admin email
        from: 'noreply@procezly.com',
        subject: 'Procezly Audit Reminder',
        html: `<p>Hello org <strong>${orgId}</strong>, your scheduled audit task is due now.</p>`,
      });

      await db.prepare(`
        INSERT INTO audit_logs (id, organization_id, user_id, action, context)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        crypto.randomUUID(),
        orgId,
        null,
        'sent_audit_email',
        JSON.stringify({ time: now.toISOString() })
      ).run();
    }
  }
};
