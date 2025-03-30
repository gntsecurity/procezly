'use client'

import { useEffect, useState, FormEvent } from 'react'
import { supabase } from '../../../utils/supabaseClient'
import { useRouter } from 'next/navigation'

type Role = 'admin' | 'user'

interface OrgUser {
  user_id: string
  email: string
  organization_id: string
  role: Role
}

interface RoleRow {
  user_id: string
  role: Role
}

export default function OrganizationSettings() {
  const router = useRouter()
  const [users, setUsers] = useState<OrgUser[]>([])
  const [roles, setRoles] = useState<RoleRow[]>([])
  const [currentUserId, setCurrentUserId] = useState<string>('')

  useEffect(() => {
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData?.session?.user.id
      setCurrentUserId(userId || '')

      const { data: userData } = await supabase.from('org_users').select('*')
      const { data: roleData } = await supabase.from('roles').select('user_id, role')

      if (userData) setUsers(userData)
      if (roleData) setRoles(roleData)
    }

    load()
  }, [])

  const updateRole = async (userId: string, newRole: Role) => {
    await supabase.from('roles').update({ role: newRole }).eq('user_id', userId)
    setRoles((prev) =>
      prev.map((r) => (r.user_id === userId ? { ...r, role: newRole } : r))
    )
  }

  const getUserRole = (userId: string): Role | undefined =>
    roles.find((r) => r.user_id === userId)?.role

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Organization Settings</h1>
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
                  getUserRole(user.user_id)
                ) : (
                  <select
                    value={getUserRole(user.user_id)}
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
