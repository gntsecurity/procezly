'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { CheckCircle, Loader, Send } from 'lucide-react'

interface Submission {
  id?: string
  card_id: string
  status: string
  notes: string
  submitted_at?: string
  user_id: string
  card_uid?: string
  user_name?: string
}

interface Card {
  id: string
  uid: string
}

interface OrgUser {
  user_id: string
  display_name: string
}

const SubmissionsPage = () => {
  const { user, isSignedIn, isLoaded } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [users, setUsers] = useState<OrgUser[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [form, setForm] = useState({ card_id: '', status: '', notes: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await fetch('/functions/api/auth').then((res) => res.json())
      if (!user?.id) return
      const uid = user.id
      setUserId(uid)

      const roleRes = await fetch(`/functions/api/roles?user_id=${uid}`)
      const roleData = await roleRes.json()

      if (!roleData) return

      setIsAdmin(roleData.role === 'admin')
      setOrgId(roleData.organization_id)

      const [{ data: cardData }, { data: orgUserData }, { data: submissionData }] = await Promise.all([
        fetch(`/functions/api/kamishibai-cards?organization_id=${roleData.organization_id}`).then((res) => res.json()),
        fetch(`/functions/api/roles-by-org?organization_id=${roleData.organization_id}`).then((res) => res.json()),
        fetch(`/functions/api/submissions?organization_id=${roleData.organization_id}`).then((res) => res.json()),
      ])

      setCards(cardData)
      setUsers(orgUserData)
      setSubmissions(submissionData)
      setLoading(false)
    }

    init()
  }, [isLoaded, isSignedIn, user])

  const handleSubmit = async () => {
    if (!form.card_id || !form.status) return
    const res = await fetch('/functions/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, user_id: userId, organization_id: orgId }),
    })
    const data = await res.json()

    setSubmissions([data, ...submissions])
    setForm({ card_id: '', status: '', notes: '' })
  }

  if (loading) return <div className="flex justify-center items-center"><Loader className="animate-spin" /></div>

  return (
    <div className="px-4 pt-6 sm:px-6 w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Submit Audits</h1>
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Submit New Audit</h2>
        <select
          className="w-full p-3 rounded-lg border border-gray-300 mb-4"
          value={form.card_id}
          onChange={(e) => setForm({ ...form, card_id: e.target.value })}
        >
          <option value="">Select Card</option>
          {cards.map((card) => (
            <option key={card.id} value={card.id}>
              {card.uid}
            </option>
          ))}
        </select>
        <select
          className="w-full p-3 rounded-lg border border-gray-300 mb-4"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="">Select Status</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Failed">Failed</option>
        </select>
        <textarea
          className="w-full p-3 rounded-lg border border-gray-300 mb-4"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <button
          onClick={handleSubmit}
          disabled={!form.card_id || !form.status}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center"
        >
          <Send size={18} className="mr-2" />
          Submit
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">Card UID</th>
              <th className="px-4 py-2 text-left text-gray-600">Status</th>
              <th className="px-4 py-2 text-left text-gray-600">Notes</th>
              <th className="px-4 py-2 text-left text-gray-600">Submitted By</th>
              <th className="px-4 py-2 text-left text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{s.card_uid}</td>
                <td className="px-4 py-2">{s.status}</td>
                <td className="px-4 py-2">{s.notes}</td>
                <td className="px-4 py-2">{s.user_name}</td>
                <td className="px-4 py-2">{new Date(s.submitted_at!).toLocaleString()}</td>
              </tr>
            ))}
            {submissions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                  No submissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SubmissionsPage
