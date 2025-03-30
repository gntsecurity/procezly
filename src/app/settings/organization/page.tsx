'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient''
import { useRouter } from 'next/navigation'

export default function OrganizationSettings() {
  const [orgId, setOrgId] = useState<string | null>(null)
  const [orgCreated, setOrgCreated] = useState<string | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [newUserEmail, setNewUserEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      const { data: user, error: userError } = await supabase.auth.getUser()
      if (userError || !user?.user?.id) return router.push('/login')

      setCurrentUserId(user.user.id)

      const { data: roleData } = await supabase
        .from('roles')
        .select('organization_id, role')
        .eq('user_id', user.user.id)
        .limit(1)
        .single()

      if (!roleData) return router.push('/login')

      setOrgId(roleData.organization_id)
      setIsAdmin(roleData.role === 'admin')

      const { data: orgMeta } = await supabase
        .from('organizations')
        .select('created_at')
        .eq('id', roleData.organization_id)
        .single()

      setOrgCreated(orgMeta?.created_at || null)

      const { data: userList } = await supabase
        .from('org_users')
        .select('*')
        .eq('organization_id', roleData.organization_id)

      setUsers(userList || [])

      const { data: logData } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('organization_id', roleData.organization_id)
        .order('timestamp', { ascending: false })
        .limit(5)

      setAuditLogs(logData || [])
    }

    loadData()
  }, [router])

  const handleAddUser = async () => {
    if (!newUserEmail || !orgId) return

    const { data: userData, error: fetchError } = await supabase
      .auth.admin.listUsers()

    if (fetchError) return

    const userToAdd = userData.users.find((u) => u.email === newUserEmail)
    if (!userToAdd) return

    const { error: insertRolesError } = await supabase
      .from('roles')
      .insert([
        {
          user_id: userToAdd.id,
          organization_id: orgId,
          role: 'user',
        },
      ])

    const { error: insertOrgUserError } = await supabase
      .from('org_users')
      .insert([
        {
          user_id: userToAdd.id,
          email: userToAdd.email,
          organization_id: orgId,
          role: 'user',
        },
      ])

    if (!insertRolesError && !insertOrgUserError) {
      setNewUserEmail('')
      const { data: refreshedUsers } = await supabase
        .from('org_users')
        .select('*')
        .eq('organization_id', orgId)

      setUsers(refreshedUsers || [])
    }
  }

  const handleRoleChange = async (user_id: string, role: string) => {
    if (user_id === currentUserId) return
    if (!orgId) return

    await supabase
      .from('roles')
      .update({ role })
      .eq('user_id', user_id)
      .eq('organization_id', orgId)

    await supabase
      .from('org_users')
      .update({ role })
      .eq('user_id', user_id)
      .eq('organization_id', orgId)

    const { data: refreshedUsers } = await supabase
      .from('org_users')
      .select('*')
      .eq('organization_id', orgId)

    setUsers(refreshedUsers || [])
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <a href="/settings" className="text-sm text-blue-600 underline block mb-4">← Back to Settings</a>
      <h2 className="text-xl font-semibold mb-2">Organization Settings</h2>
      {orgId && (
        <div className="text-sm mb-4">
          <p><strong>Organization ID:</strong> {orgId}</p>
          <p><strong>Created:</strong> {orgCreated}</p>
        </div>
      )}

      <h3 className="font-semibold mt-6 mb-2">Users</h3>
      {isAdmin && (
        <div className="flex gap-2 mb-4">
          <input
            type="email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            className="border px-2 py-1 rounded w-full"
            placeholder="Enter user email"
          />
          <button
            onClick={handleAddUser}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            Add User
          </button>
        </div>
      )}

      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.user_id}
            className="flex justify-between items-center border px-3 py-2 rounded"
          >
            <div>
              <div className="text-sm">{user.email}</div>
              <div className="text-xs text-gray-600">{user.role}</div>
            </div>
            {isAdmin && user.user_id !== currentUserId && (
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                className="border px-2 py-1 rounded text-sm"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            )}
          </div>
        ))}
      </div>

      <h3 className="font-semibold mt-6 mb-2">Audit Log (Last 5)</h3>
      <div className="text-sm space-y-1">
        {auditLogs.map((log) => (
          <div key={log.id}>
            {log.timestamp} - {log.description}
          </div>
        ))}
      </div>
    </div>
  )
}
