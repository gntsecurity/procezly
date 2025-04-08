export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { searchParams } = new URL(context.request.url);
  const orgId = searchParams.get("organization_id");

  if (!orgId) {
    return new Response("Missing organization_id", { status: 400 });
  }

  const result = await context.env.DB
    .prepare(`SELECT * FROM audit_schedule_settings WHERE organization_id = ? LIMIT 1`)
    .bind(orgId)
    .first();

  if (!result) {
    return new Response("Not found", { status: 404 });
  }

  return Response.json(result);
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = await context.request.json();

  const {
    organization_id,
    frequency,
    day_of_week,
    time_of_day,
    timezone,
    is_active
  } = body;

  if (!organization_id || !frequency || !time_of_day || !timezone) {
    return new Response("Missing required fields", { status: 400 });
  }

  await context.env.DB
    .prepare(
      `INSERT INTO audit_schedule_settings (
        organization_id, frequency, day_of_week, time_of_day, timezone, is_active
      ) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(organization_id) DO UPDATE SET
        frequency = excluded.frequency,
        day_of_week = excluded.day_of_week,
        time_of_day = excluded.time_of_day,
        timezone = excluded.timezone,
        is_active = excluded.is_active`
    )
    .bind(
      organization_id,
      frequency,
      day_of_week,
      time_of_day,
      timezone,
      is_active ? 1 : 0
    )
    .run();

  return new Response("Saved", { status: 200 });
};
