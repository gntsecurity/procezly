'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../utils/supabaseClient''
import { useRouter } from 'next/navigation'

export default function OrganizationSettings() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [orgInfo, setOrgInfo] = useState<any>(null)
  const [orgUsers, setOrgUsers] = useState<any[]>([])
  const [email, setEmail] = useState('')
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) return router.push('/login')
      setUser(user)

      const { data: roles } = await supabase
        .from('roles')
        .select('organization_id, role')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!roles) return

      const { data: org } = await supabase
        .from('organizations')
        .select('id, created_at')
        .eq('id', roles.organization_id)
        .maybeSingle()

      const { data: users } = await supabase
        .from('org_users')
        .select('*')
        .eq('organization_id', roles.organization_id)

      const { count: cardsCount } = await supabase
        .from('kamishibai_cards')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', roles.organization_id)

      const { count: subsCount } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', roles.organization_id)

      const { data: auditLog } = await supabase
        .from('audit_logs')
        .select('event, created_at')
        .eq('organization_id', roles.organization_id)
        .order('created_at', { ascending: false })
        .limit(5)

      setOrgInfo({
        id: org?.id,
        created_at: org?.created_at,
        cards: cardsCount || 0,
        submissions: subsCount || 0,
        role: roles.role,
      })

      setOrgUsers(users || [])
      setLogs(auditLog || [])
    }

    fetchData()
  }, [router])

  const promoteUser = async (targetId: string) => {
    if (!user || !orgInfo) return
    await supabase
      .from('roles')
      .update({ role: 'admin' })
      .eq('user_id', targetId)
      .eq('organization_id', orgInfo.id)
    location.reload()
  }

  const addUser = async () => {
    if (!email || !orgInfo) return

    const { data: userLookup } = await supabase
      .from('org_users')
      .select('user_id')
      .eq('email', email)
      .maybeSingle()

    if (userLookup) return

    const { data: newUser } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    })

    if (!newUser?.user?.id) return

    await supabase.from('roles').insert({
      user_id: newUser.user.id,
      organization_id: orgInfo.id,
      role: 'user',
    })

    location.reload()
  }

  return (
    <div className="p-6">
      <a href="/settings" className="text-sm text-blue-500 underline block mb-4">
        ← Back to Settings
      </a>
      <h1 className="text-xl font-semibold mb-4">Organization Settings</h1>
      {orgInfo && (
        <div className="mb-6">
          <p><strong>Organization ID:</strong> {orgInfo.id}</p>
          <p><strong>Created:</strong> {new Date(orgInfo.created_at).toLocaleString()}</p>
          <p><strong>Kamishibai Cards:</strong> {orgInfo.cards}</p>
          <p><strong>Submissions:</strong> {orgInfo.submissions}</p>
        </div>
      )}

      <h2 className="text-md font-semibold mb-2">Users</h2>
      {orgInfo?.role === 'admin' && (
        <div className="flex gap-2 items-center mb-4">
          <input
            className="border rounded px-2 py-1 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <button className="text-blue-500 text-sm" onClick={addUser}>
            Add User
          </button>
        </div>
      )}

      {orgUsers.map((u) => (
        <div key={u.user_id} className="text-sm mb-1 flex gap-2 items-center">
          <span>{u.email}</span>
          <span className="text-gray-500">({u.role})</span>
          {orgInfo?.role === 'admin' && u.user_id !== user?.id && u.role !== 'admin' && (
            <button className="text-xs text-blue-600" onClick={() => promoteUser(u.user_id)}>
              Make Admin
            </button>
          )}
        </div>
      ))}

      <h2 className="text-md font-semibold mt-6 mb-2">Audit Log (Last 5)</h2>
      {logs.map((log, idx) => (
        <div key={idx} className="text-sm text-gray-700">
          {new Date(log.created_at).toLocaleString()} — {log.event}
        </div>
      ))}
    </div>
  )
}
