'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../utils/supabaseClient'

type Role = 'admin' | 'user'

interface OrgUser {
  user_id: string
  email: string
  organization_id: string
  role: Role
}

export default function OrganizationSettings() {
  const [users, setUsers] = useState<OrgUser[]>([])
  const [currentUserId, setCurrentUserId] = useState<string>('')

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const userId = session?.user.id || ''
      setCurrentUserId(userId)

      const { data } = await supabase.from('org_users').select('*')
      if (data) setUsers(data as OrgUser[])
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
