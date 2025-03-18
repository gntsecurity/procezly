import { NextResponse } from "next/server";
import { supabase } from "/lib/supabase";

export async function POST(req: Request) {
  const { email, role } = await req.json();

  // Get the logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Not authorized" }, { status: 401 });

  // Get user's organization
  const { data: orgData, error: orgError } = await supabase
    .from("user_organizations")
    .select("organization_id")
    .eq("user_id", user.id)
    .single();

  if (orgError || !orgData) {
    return NextResponse.json({ error: "You must belong to an organization to invite users" }, { status: 400 });
  }

  // Ensure user is an admin
  const { data: isAdmin } = await supabase
    .from("user_organizations")
    .select("role")
    .eq("user_id", user.id)
    .eq("organization_id", orgData.organization_id)
    .single();

  if (isAdmin?.role !== "admin") {
    return NextResponse.json({ error: "Only admins can invite users" }, { status: 403 });
  }

  // Create pending user invite
  const { data: invite, error: inviteError } = await supabase
    .from("user_organizations")
    .insert([{ user_id: email, organization_id: orgData.organization_id, role }]);

  if (inviteError) return NextResponse.json({ error: inviteError.message }, { status: 400 });

  return NextResponse.json({ success: "Invite sent!" }, { status: 200 });
}
