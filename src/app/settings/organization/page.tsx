'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../utils/supabaseClient';

type Org = {
  id: string;
  created_at: string;
};

type User = {
  id: string;
  email: string;
  role: string;
};

type AuditLog = {
  id: string;
  action: string;
  timestamp: string;
};

export default function OrganizationSettings() {
  const [org, setOrg] = useState<Org | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState({ cards: 0, submissions: 0 });
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user.id;
      if (!userId) return;

      const { data: role } = await supabase
        .from('roles')
        .select('organization_id')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      const orgId = role?.organization_id;
      if (!orgId) return;

      const { data: org } = await supabase
        .from('organizations')
        .select('id, created_at')
        .eq('id', orgId)
        .single();

      setOrg(org);

      const { data: roleRows } = await supabase
        .from('roles')
        .select('id, user_id, role')
        .eq('organization_id', orgId);

      const userIds = roleRows?.map(r => r.user_id) || [];

      const { data: userRows } = await supabase
        .from('users_view')
        .select('id, email')
        .in('id', userIds);

      const mergedUsers = roleRows?.map(role => ({
        id: role.id,
        user_id: role.user_id,
        role: role.role,
        email: userRows?.find(u => u.id === role.user_id)?.email || '',
      })) ?? [];

      setUsers(mergedUsers);

      const { data: audit } = await supabase
        .from('audit_logs')
        .select('id, action, timestamp')
        .eq('organization_id', orgId)
        .order('timestamp', { ascending: false })
        .limit(5);

      setLogs(audit || []);

      const { count: cardCount } = await supabase
        .from('kamishibai_cards')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', orgId);

      const { count: submissionCount } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', orgId);

      setStats({
        cards: cardCount || 0,
        submissions: submissionCount || 0,
      });
    };

    load();
  }, []);

  const toggleRole = async (id: string, current: string) => {
    const newRole = current === 'admin' ? 'user' : 'admin';
    setUpdatingId(id);
    await supabase.from('roles').update({ role: newRole }).eq('id', id);
    setUsers(users.map(u => (u.id === id ? { ...u, role: newRole } : u)));
    setUpdatingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link href="/settings" className="text-sm text-blue-600 hover:underline">
        ← Back to Settings
      </Link>
      <h2 className="text-2xl font-bold mt-4">Organization Settings</h2>

      {org && (
        <div className="mt-4 text-sm space-y-1">
          <div><strong>Organization ID:</strong> {org.id}</div>
          <div><strong>Created:</strong> {new Date(org.created_at).toLocaleString()}</div>
          <div><strong>Kamishibai Cards:</strong> {stats.cards}</div>
          <div><strong>Submissions:</strong> {stats.submissions}</div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Users</h3>
        <ul className="space-y-2">
          {users.map(u => (
            <li
              key={u.id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <div>
                <p className="text-sm font-medium">{u.email}</p>
                <p className="text-xs text-gray-500 capitalize">{u.role}</p>
              </div>
              <button
                onClick={() => toggleRole(u.id, u.role)}
                disabled={updatingId === u.id}
                className="text-sm text-blue-600 underline"
              >
                Make {u.role === 'admin' ? 'User' : 'Admin'}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Audit Log (Last 5)</h3>
        <ul className="text-sm space-y-1">
          {logs.map((log) => (
            <li key={log.id} className="border p-2 rounded">
              <p>{log.action}</p>
              <p className="text-xs text-gray-500">
                {new Date(log.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
