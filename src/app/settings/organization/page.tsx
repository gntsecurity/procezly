'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../utils/supabaseClient'
import Link from 'next/link'

type Role = 'admin' | 'user'

interface OrgUser {
  user_id: string
  email: string
  organization_id: string
  role: Role
}

interface OrgInfo {
  id: string
  name: string
}

export default function OrganizationSettings() {
  const [users, setUsers] = useState<OrgUser[]>([])
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [orgInfo, setOrgInfo] = useState<OrgInfo | null>(null)

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const userId = session?.user.id || ''
      setCurrentUserId(userId)

      const { data } = await supabase.from('org_users').select('*')
      if (data) {
        setUsers(data as OrgUser[])
        const orgId = data[0]?.organization_id
        if (orgId) {
          const { data: org } = await supabase
            .from('organizations')
            .select('id, name')
            .eq('id', orgId)
            .single()
          if (org) setOrgInfo(org as OrgInfo)
        }
      }
    }

    load()
  }, [])

  const updateRole = async (userId: string, newRole: Role) => {
    await supabase
      .from('roles')
      .update({ role: newRole })
      .eq('user_id', userId)

    setUsers((prev) =>
      prev.map((u) =>
        u.user_id === userId ? { ...u, role: newRole } : u
      )
    )
  }

  return (
    <div className="p-6">
      <Link href="/settings" className="text-sm text-blue-600 underline mb-4 block">
        ← Back to Settings
      </Link>
      <h1 className="text-xl font-bold mb-4">Organization Settings</h1>

      {orgInfo && (
        <div className="mb-6 space-y-1">
          <div><strong>Organization UID:</strong> {orgInfo.id}</div>
          <div><strong>Organization Name:</strong> {orgInfo.name}</div>
        </div>
      )}

      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">
                {user.user_id === currentUserId ? (
                  user.role
                ) : (
                  <select
                    value={user.role}
                    onChange={(e) =>
                      updateRole(user.user_id, e.target.value as Role)
                    }
                    className="border px-2 py-1 rounded"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
