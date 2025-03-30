
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
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;
      if (!userId) return;
      setCurrentUserId(userId);

      const { data: roleData } = await supabase
        .from('roles')
        .select('organization_id')
        .eq('user_id', userId)
        .single();

      const orgId = roleData?.organization_id;
      if (!orgId) return;

      const { data: orgData } = await supabase
        .from('organizations')
        .select('id, created_at')
        .eq('id', orgId)
        .single();
      setOrg(orgData);

      const { data: usersData } = await supabase
        .from('roles')
        .select('user_id, role, user_id!inner(auth.users(id, email))')
        .eq('organization_id', orgId);

      const formattedUsers = usersData?.map((u: any) => ({
        id: u.user_id,
        email: u.auth_users?.email || 'Unknown',
        role: u.role,
      })) || [];

      setUsers(formattedUsers);

      const { data: logData } = await supabase
        .from('audit_logs')
        .select('id, action, timestamp')
        .eq('organization_id', orgId)
        .order('timestamp', { ascending: false })
        .limit(5);
      setLogs(logData || []);

      const { count: cardCount } = await supabase
        .from('kamishibai_cards')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', orgId);

      const { count: submissionCount } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', orgId);

      setStats({ cards: cardCount || 0, submissions: submissionCount || 0 });
    };

    load();
  }, []);

  const toggleRole = async (user: User) => {
    setUpdatingId(user.id);
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    await supabase
      .from('roles')
      .update({ role: newRole })
      .eq('user_id', user.id);
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
    );
    setUpdatingId(null);
  };

  return (
    <div className="p-4">
      <Link href="/settings" className="text-sm text-blue-600 underline block mb-4">
        ← Back to Settings
      </Link>
      <h2 className="text-xl font-bold mb-2">Organization Settings</h2>

      {org && (
        <div className="mb-4">
          <p><strong>Organization ID:</strong> {org.id}</p>
          <p><strong>Created:</strong> {new Date(org.created_at).toLocaleString()}</p>
          <p><strong>Kamishibai Cards:</strong> {stats.cards}</p>
          <p><strong>Submissions:</strong> {stats.submissions}</p>
        </div>
      )}

      <h3 className="font-semibold mb-2">Users</h3>
      <div className="space-y-2 mb-6">
        {users.map((user) => (
          <div key={user.id} className="flex justify-between items-center border px-4 py-2 rounded">
            <div>{user.email}</div>
            <div className="text-sm text-gray-500">{user.role}</div>
            {user.id !== currentUserId && (
              <button
                onClick={() => toggleRole(user)}
                disabled={updatingId === user.id}
                className="text-blue-600 text-sm underline ml-4"
              >
                Make {user.role === 'admin' ? 'User' : 'Admin'}
              </button>
            )}
          </div>
        ))}
      </div>

      <h3 className="font-semibold mb-2">Audit Log (Last 5)</h3>
      <ul className="text-sm space-y-1">
        {logs.map((log) => (
          <li key={log.id}>
            {new Date(log.timestamp).toLocaleString()}: {log.action}
          </li>
        ))}
      </ul>
    </div>
  );
}
