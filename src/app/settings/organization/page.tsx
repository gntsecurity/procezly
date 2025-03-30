'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../utils/supabaseClient';
import { createClient } from '@supabase/supabase-js';

type RoleEntry = {
  id: string;
  user_id: string;
  role: string;
};

type AuditLogEntry = {
  id: string;
  action: string;
  timestamp: string;
  context: Record<string, unknown>;
};

export default function OrganizationSettings() {
  const [organizationId, setOrganizationId] = useState<string>('');
  const [createdAt, setCreatedAt] = useState<string>('');
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [cardCount, setCardCount] = useState<number>(0);
  const [submissionCount, setSubmissionCount] = useState<number>(0);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: {
          session,
        },
      } = await supabase.auth.getSession();

      const user = session?.user;
      if (!user) return;

      const { data: roles } = await supabase
        .from('roles')
        .select('organization_id')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (!roles) return;

      const orgId = roles.organization_id;
      setOrganizationId(orgId);

      const { data: orgData } = await supabase
        .from('organizations')
        .select('created_at')
        .eq('id', orgId)
        .single();

      if (orgData) setCreatedAt(orgData.created_at);

      const { data: userList } = await supabase
        .from('users_view')
        .select('*')
        .eq('organization_id', orgId);

      setUsers(userList || []);

      const { data: logs } = await supabase
        .from('audit_logs')
        .select('id, action, timestamp, context')
        .eq('organization_id', orgId)
        .order('timestamp', { ascending: false })
        .limit(5);

      setAuditLogs(logs || []);

      const { count: cardCount } = await supabase
        .from('kamishibai_cards')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', orgId);

      setCardCount(cardCount || 0);

      const { count: submissionCount } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', orgId);

      setSubmissionCount(submissionCount || 0);
    };

    fetchData();
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    setUpdating(true);
    await supabase.from('roles').update({ role: newRole }).eq('id', id);
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
    setUpdating(false);
  };

  const handleAddUser = async (email: string) => {
    const response = await fetch('/functions/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    await response.json();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link href="/settings" className="text-sm text-blue-600 hover:underline">
        ← Back to Settings
      </Link>
      <h2 className="text-2xl font-bold mt-4">Organization Settings</h2>

      <div className="mt-6">
        <p className="text-sm">Organization ID:</p>
        <p className="font-mono text-blue-600 break-all">{organizationId}</p>
        <p className="mt-2 text-sm text-gray-500">
          Created: {createdAt ? new Date(createdAt).toLocaleString() : '...'}
        </p>
        <p className="mt-2">Kamishibai Cards: {cardCount}</p>
        <p className="mt-1">Submissions: {submissionCount}</p>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Invite User</h3>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const email = (e.target as any).email.value;
            if (email) handleAddUser(email);
          }}
        >
          <input
            name="email"
            placeholder="user@example.com"
            className="border px-2 py-1 text-sm rounded w-full"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Add
          </button>
        </form>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Users</h3>
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="flex justify-between items-center border p-2 rounded">
              <div>
                <p className="text-sm font-medium">{user.email}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <select
                disabled={updating}
                value={user.role}
                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Audit Log (Last 5)</h3>
        <ul className="text-sm space-y-1">
          {auditLogs.map((log) => (
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
