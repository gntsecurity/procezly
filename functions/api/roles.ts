export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { searchParams } = new URL(context.request.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return new Response("Missing user_id", { status: 400 });
  }

  const query = `
    SELECT role, organization_id
    FROM org_users
    WHERE user_id = ?
    LIMIT 1
  `;

  const result = await context.env.DB.prepare(query).bind(user_id).first();

  if (!result) {
    return new Response("User not found", { status: 404 });
  }

  return Response.json(result);
};
