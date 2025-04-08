'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'

interface Submission {
  id: string
  card_id: string
  status: string
  notes: string
  submitted_at: string
  user_id: string
  organization_id: string
}

export default function ExportsPage() {
  const { user, isSignedIn, isLoaded } = useUser()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    const fetchData = async () => {
      const roleRes = await fetch(`/functions/api/roles?user_id=${user.id}`)
      const roleData = await roleRes.json()
      const orgId = roleData.organization_id

      const submissionRes = await fetch(
        `/functions/api/submissions?organization_id=${orgId}`
      )
      const submissionData: Submission[] = await submissionRes.json()

      setSubmissions(submissionData)
      setLoading(false)
    }

    fetchData()
  }, [isLoaded, isSignedIn, user])

  if (!isLoaded || !isSignedIn) return null

  return (
    <div className="px-4 pt-6 sm:px-6 w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Export Data</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        {loading ? (
          <p className="text-gray-600 text-sm">Loading submissions...</p>
        ) : submissions.length === 0 ? (
          <p className="text-gray-600 text-sm">No submissions to export.</p>
        ) : (
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-2">Card ID</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Notes</th>
                <th className="px-4 py-2">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="px-4 py-2">{s.card_id}</td>
                  <td className="px-4 py-2">{s.status}</td>
                  <td className="px-4 py-2">{s.notes}</td>
                  <td className="px-4 py-2">
                    {new Date(s.submitted_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
