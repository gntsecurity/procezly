'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../utils/supabaseClient';

type Org = {
  id: string;
  created_at: string;
};

type OrgUser = {
  user_id: string;
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
  const [users, setUsers] = useState<OrgUser[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState({ cards: 0, submissions: 0 });
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user.id;
      if (!userId) return;
      setCurrentUserId(userId);

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

      const { data: orgUsers } = await supabase
        .from('org_users')
        .select('user_id, email, role')
        .eq('organization_id', orgId);

      setUsers(orgUsers || []);

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

  const toggleRole = async (user_id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    setUpdatingId(user_id);
    await supabase.from('roles').update({ role: newRole }).eq('user_id', user_id);
    setUsers(users.map(u => (u.user_id === user_id ? { ...u, role: newRole } : u)));
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
          {users.map((u) => (
            <li
              key={u.user_id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <div>
                <p className="text-sm font-medium">{u.email}</p>
                <p className="text-xs text-gray-500 capitalize">{u.role}</p>
              </div>
              {u.user_id !== currentUserId && (
                <button
                  onClick={() => toggleRole(u.user_id, u.role)}
                  disabled={updatingId === u.user_id}
                  className="text-sm text-blue-600 underline"
                >
                  Make {u.role === 'admin' ? 'User' : 'Admin'}
                </button>
              )}
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
