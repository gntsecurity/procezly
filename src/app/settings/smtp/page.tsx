'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../../utils/supabaseClient'

const SmtpSettingsPage = () => {
  const [orgId, setOrgId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)

  const [form, setForm] = useState({
    host: '',
    port: 587,
    username: '',
    password: '',
    from_email: '',
    secure: false,
  })

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

      const { data: existing } = await supabase
        .from('smtp_settings')
        .select('*')
        .eq('organization_id', roleData.organization_id)
        .single()

      if (existing) setForm(existing)
    }

    init()
  }, [])

  const handleSave = async () => {
    if (!orgId) return
    setSaving(true)

    const payload = {
      ...form,
      organization_id: orgId,
    }

    const { error } = await supabase
      .from('smtp_settings')
      .upsert(payload, { onConflict: 'organization_id' })

    if (error) console.error(error)
    setSaving(false)
  }

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)

    const res = await fetch('/api/test-smtp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const result = await res.json()
    setTestResult(result.success ? 'Test successful.' : `Failed: ${result.error}`)
    setTesting(false)
  }

  if (!isAdmin) return null

  return (
    <div className="px-4 pt-6 sm:px-6 w-full max-w-3xl mx-auto">
      <Link
        href="/settings"
        className="text-sm text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to Settings
      </Link>

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">SMTP Settings</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <label className="block">
          <span className="block mb-1 text-sm text-gray-700">SMTP Host</span>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={form.host}
            onChange={(e) => setForm({ ...form, host: e.target.value })}
          />
        </label>

        <label className="block">
          <span className="block mb-1 text-sm text-gray-700">Port</span>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={form.port}
            onChange={(e) => setForm({ ...form, port: parseInt(e.target.value) })}
          />
        </label>

        <label className="block">
          <span className="block mb-1 text-sm text-gray-700">Username</span>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Leave blank if no auth"
          />
        </label>

        <label className="block">
          <span className="block mb-1 text-sm text-gray-700">Password</span>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Leave blank if no auth"
          />
        </label>

        <label className="block">
          <span className="block mb-1 text-sm text-gray-700">From Email</span>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={form.from_email}
            onChange={(e) => setForm({ ...form, from_email: e.target.value })}
          />
        </label>

        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={form.secure}
            onChange={(e) => setForm({ ...form, secure: e.target.checked })}
          />
          <span className="text-sm text-gray-700">Use secure connection (SSL/TLS)</span>
        </label>

        {testResult && (
          <div
            className={`text-sm ${
              testResult.startsWith('Test successful') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {testResult}
          </div>
        )}

        <div className="pt-4 flex gap-3">
          <button
            onClick={handleTest}
            disabled={testing}
            className="px-5 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            {testing ? 'Testing...' : 'Test Settings'}
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SmtpSettingsPage
