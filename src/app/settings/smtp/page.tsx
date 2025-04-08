'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

const SmtpSettingsPage = () => {
  const router = useRouter()
  const { user, isSignedIn, isLoaded } = useUser()

  const [orgId, setOrgId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)

  const [form, setForm] = useState({
    smtp_host: '',
    smtp_port: 587,
    smtp_user: '',
    smtp_pass: '',
    secure: false,
  })

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    const init = async () => {
      const userId = user.id
      const res = await fetch(`/functions/api/roles?user_id=${userId}`)
      const roleData = await res.json()

      if (!roleData) return

      setOrgId(roleData.organization_id)
      setIsAdmin(roleData.role === 'admin')

      const existing = await fetch(
        `/functions/api/smtp-settings?organization_id=${roleData.organization_id}`
      )
      if (existing.ok) {
        const data = await existing.json()
        setForm(data)
      }
    }

    init()
  }, [isLoaded, isSignedIn, user])

  const handleSave = async () => {
    if (!orgId) return
    setSaving(true)

    const payload = {
      ...form,
      organization_id: orgId,
    }

    await fetch('/functions/api/smtp-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setSaving(false)
  }

  const handleTest = async () => {
    if (!orgId) return
    setTesting(true)
    setTestResult(null)

    const res = await fetch('/functions/api/send-test-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organization_id: orgId }),
    })

    setTestResult(res.ok ? 'success' : 'error')
    setTesting(false)
  }

  if (!isLoaded || !isSignedIn || !isAdmin) return null

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
            value={form.smtp_host}
            onChange={(e) => setForm({ ...form, smtp_host: e.target.value })}
          />
        </label>

        <label className="block">
          <span className="block mb-1 text-sm text-gray-700">Port</span>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={form.smtp_port}
            onChange={(e) => setForm({ ...form, smtp_port: parseInt(e.target.value) })}
          />
        </label>

        <label className="block">
          <span className="block mb-1 text-sm text-gray-700">Username</span>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={form.smtp_user}
            onChange={(e) => setForm({ ...form, smtp_user: e.target.value })}
          />
        </label>

        <label className="block">
          <span className="block mb-1 text-sm text-gray-700">Password</span>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={form.smtp_pass}
            onChange={(e) => setForm({ ...form, smtp_pass: e.target.value })}
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

        <div className="pt-4 flex gap-3 items-center">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>

          <button
            onClick={handleTest}
            disabled={testing}
            className="px-5 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded hover:bg-gray-200"
          >
            {testing ? 'Sending...' : 'Send Test Email'}
          </button>

          {testResult === 'success' && (
            <span className="text-green-600 text-sm">✓ Test email sent</span>
          )}
          {testResult === 'error' && (
            <span className="text-red-600 text-sm">✗ Test failed</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default SmtpSettingsPage
