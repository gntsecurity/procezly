"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import QRCode from "qrcode";
import { supabase } from "../../../utils/supabaseClient";
import { createClient } from "@supabase/supabase-js";

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Org = {
  id: string;
  name: string;
  timezone: string;
  created_at: string;
};

type RoleUser = {
  user_id: string;
  role: string;
  email: string;
};

type AuditLog = {
  id: string;
  timestamp: string;
  action: string;
};

const OrganizationSettingsPage = () => {
  const [org, setOrg] = useState<Org | null>(null);
  const [users, setUsers] = useState<RoleUser[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState({ cards: 0, submissions: 0 });
  const [isAdmin, setIsAdmin] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [qrUrl, setQrUrl] = useState("");

  const fetchData = async () => {
    const { data: session } = await supabase.auth.getUser();
    const userId = session?.user?.id;
    if (!userId) return;

    const { data: role } = await supabase
      .from("roles")
      .select("role, organization_id")
      .eq("user_id", userId)
      .single();

    if (!role) return;
    setIsAdmin(role.role === "admin");

    const { data: organization } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", role.organization_id)
      .single();

    setOrg(organization);

    const { data: roleUsers } = await supabase
      .from("roles")
      .select("user_id, role")
      .eq("organization_id", role.organization_id);

    const userIds = roleUsers.map((r) => r.user_id);

    const { data: authUsers } = await supabase
      .from("users_view")
      .select("id, email")
      .in("id", userIds);

    const merged = roleUsers.map((r) => ({
      ...r,
      email: authUsers.find((u) => u.id === r.user_id)?.email || "",
    }));

    setUsers(merged);

    const { data: audit } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("organization_id", role.organization_id)
      .order("timestamp", { ascending: false })
      .limit(5);

    setLogs(audit || []);

    const { count: cards } = await supabase
      .from("kamishibai_cards")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", role.organization_id);

    const { count: submissions } = await supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", role.organization_id);

    setStats({ cards: cards || 0, submissions: submissions || 0 });

    const link = `${window.location.origin}/invite/${role.organization_id}`;
    setInviteLink(link);

    const qr = await QRCode.toDataURL(link);
    setQrUrl(qr);
  };

  const addUser = async () => {
    if (!emailInput || !org) return;

    const { data: newUser, error } = await adminClient.auth.admin.createUser({
      email: emailInput,
      email_confirm: true,
    });

    if (newUser?.user?.id) {
      await supabase.from("roles").insert({
        user_id: newUser.user.id,
        organization_id: org.id,
        role: "user",
      });

      setEmailInput("");
      fetchData();
    } else {
      console.error(error);
    }
  };

  const toggleRole = async (user_id: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    await supabase
      .from("roles")
      .update({ role: newRole })
      .eq("user_id", user_id)
      .eq("organization_id", org?.id);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!isAdmin || !org) return null;

  return (
    <div className="px-4 pt-6 sm:px-6 w-full max-w-5xl mx-auto">
      <Link
        href="/settings"
        className="text-sm text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to Settings
      </Link>

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Organization Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border rounded p-4 space-y-2">
          <div><strong>Name:</strong> {org.name}</div>
          <div><strong>Timezone:</strong> {org.timezone}</div>
          <div><strong>UUID:</strong> {org.id}</div>
          <div><strong>Created:</strong> {new Date(org.created_at).toLocaleString()}</div>
        </div>
        <div className="bg-white border rounded p-4 space-y-2">
          <div><strong>Kamishibai Cards:</strong> {stats.cards}</div>
          <div><strong>Submissions:</strong> {stats.submissions}</div>
          <div><strong>Invite Link:</strong> <a href={inviteLink} className="text-blue-600 underline">{inviteLink}</a></div>
          {qrUrl && (
            <Image
              src={qrUrl}
              alt="QR Code"
              width={100}
              height={100}
              className="mt-2"
            />
          )}
        </div>
      </div>

      <div className="bg-white border rounded p-4 mb-8">
        <h2 className="text-lg font-medium mb-4">Add New User</h2>
        <div className="flex gap-4">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Email address"
            className="flex-1 border px-3 py-2 rounded"
          />
          <button
            onClick={addUser}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>

      <div className="bg-white border rounded p-4 mb-8">
        <h2 className="text-lg font-medium mb-4">Users</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Email</th>
              <th className="text-left py-2">Role</th>
              <th className="text-left py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.user_id} className="border-t">
                <td className="py-2">{u.email}</td>
                <td className="py-2 capitalize">{u.role}</td>
                <td className="py-2">
                  <button
                    onClick={() => toggleRole(u.user_id, u.role)}
                    className="text-sm text-blue-600 underline"
                  >
                    Make {u.role === "admin" ? "User" : "Admin"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white border rounded p-4 mb-8">
        <h2 className="text-lg font-medium mb-4">Recent Audit Logs</h2>
        <ul className="text-sm space-y-2">
          {logs.map((log) => (
            <li key={log.id}>
              [{new Date(log.timestamp).toLocaleString()}] {log.action}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrganizationSettingsPage;
