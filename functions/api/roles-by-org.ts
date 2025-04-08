export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { searchParams } = new URL(context.request.url);
  const orgId = searchParams.get("organization_id");

  if (!orgId) {
    return new Response("Missing organization_id", { status: 400 });
  }

  const result = await context.env.DB
    .prepare(`SELECT user_id FROM org_users WHERE organization_id = ?`)
    .bind(orgId)
    .all();

  return Response.json(result.results);
};
