export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { searchParams } = new URL(context.request.url);
  const orgId = searchParams.get("organization_id");
  const limit = parseInt(searchParams.get("limit") || "10");

  if (!orgId) {
    return new Response("Missing organization_id", { status: 400 });
  }

  const result = await context.env.DB
    .prepare(
      `SELECT action, timestamp FROM audit_logs WHERE organization_id = ? ORDER BY timestamp DESC LIMIT ?`
    )
    .bind(orgId, limit)
    .all();

  return Response.json(result.results);
};
