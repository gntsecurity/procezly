'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../utils/supabaseClient'

const SmtpSettingsPage = () => {
  const [orgId, setOrgId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [form, setForm] = useState({
    host: '',
    port: 25,
    from_email: '',
    to_email: '',
    secure: false,
  })
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user?.user?.id) return

      const { data: roleData } = await supabase
        .from('roles')
        .select('role, organization_id')
        .eq('user_id', user.user.id)
        .single()

      if (!roleData) return
      setOrgId(roleData.organization_id)
      setIsAdmin(roleData.role === 'admin')
    }
    init()
  }, [])

  const testSMTP = async () => {
    setTesting(true)
    setTestResult(null)

    const res = await fetch('/functions/test-smtp', {
      method: 'POST',
      body: JSON.stringify(form),
    })

    const data = await res.json()
    if (data.success) setTestResult('SMTP connection successful.')
    else setTestResult(`SMTP failed: ${data.error}`)

    setTesting(false)
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl font-bold mb-4">SMTP Settings</h1>
      {isAdmin ? (
        <form className="space-y-4">
          <input type="text" placeholder="SMTP Host" value={form.host} onChange={(e) => setForm({ ...form, host: e.target.value })} className="w-full border p-2 rounded" />
          <input type="number" placeholder="Port" value={form.port} onChange={(e) => setForm({ ...form, port: +e.target.value })} className="w-full border p-2 rounded" />
          <input type="email" placeholder="From Email" value={form.from_email} onChange={(e) => setForm({ ...form, from_email: e.target.value })} className="w-full border p-2 rounded" />
          <input type="email" placeholder="To Email (test target)" value={form.to_email} onChange={(e) => setForm({ ...form, to_email: e.target.value })} className="w-full border p-2 rounded" />
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={form.secure} onChange={(e) => setForm({ ...form, secure: e.target.checked })} />
            <span>Use secure connection (SSL/TLS)</span>
          </label>

          <button type="button" onClick={testSMTP} disabled={testing} className="bg-blue-600 text-white px-4 py-2 rounded">
            {testing ? 'Testing...' : 'Test SMTP'}
          </button>

          {testResult && (
            <div className={`mt-2 ${testResult.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
              {testResult}
            </div>
          )}
        </form>
      ) : (
        <p>You are not authorized to manage SMTP settings.</p>
      )}
    </div>
  )
}

export default SmtpSettingsPage
