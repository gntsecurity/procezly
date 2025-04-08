export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { searchParams } = new URL(context.request.url);
  const orgId = searchParams.get("organization_id");

  if (!orgId) {
    return new Response("Missing organization_id", { status: 400 });
  }

  const result = await context.env.DB
    .prepare(`SELECT * FROM kamishibai_cards WHERE organization_id = ?`)
    .bind(orgId)
    .all();

  return Response.json(result.results);
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const body = await context.request.json();
  const { id, audit_phase } = body;

  if (!id || !audit_phase) {
    return new Response("Missing card id or audit_phase", { status: 400 });
  }

  await context.env.DB
    .prepare(`UPDATE kamishibai_cards SET audit_phase = ? WHERE id = ?`)
    .bind(audit_phase, id)
    .run();

  return new Response("Card updated", { status: 200 });
};
