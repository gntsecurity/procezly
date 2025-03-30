'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../utils/supabaseClient'
import Link from 'next/link'
import { Pencil, X } from 'lucide-react'

type Role = 'admin' | 'user' //push

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
  const [currentName, setCurrentName] = useState<string>('')
  const [editOpen, setEditOpen] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [orgInfo, setOrgInfo] = useState<OrgInfo | null>(null)

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const userId = session?.user.id || ''
      setCurrentUserId(userId)

      const metaName = session?.user?.user_metadata?.full_name || ''
      setCurrentName(metaName)
      setNameInput(metaName)

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

  const saveName = async () => {
    if (!currentUserId || !nameInput.trim()) return
    const { error } = await supabase.auth.updateUser({
      data: { full_name: nameInput.trim() }
    })
    if (!error) {
      setCurrentName(nameInput.trim())
      setEditOpen(false)
    }
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

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Your Display Name</h2>
        <div className="flex items-center gap-3">
          <span className="text-gray-800">{currentName || '(not set)'}</span>
          <button onClick={() => setEditOpen(true)} className="text-blue-600 hover:text-blue-800">
            <Pencil size={18} />
          </button>
        </div>
      </div>

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

      {editOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setEditOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4">Edit Display Name</h2>
            <input
              className="border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Your name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={saveName}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
