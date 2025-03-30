'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '../../../types/supabase'

type Submission = Database['public']['Tables']['submissions']['Row']
type Card = Database['public']['Tables']['kamishibai_cards']['Row']

export default function SubmissionsPage() {
  const supabase = createClientComponentClient<Database>()
  const [cards, setCards] = useState<Card[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [displayNames, setDisplayNames] = useState<Record<string, string>>({})
  const [selectedCard, setSelectedCard] = useState('')
  const [status, setStatus] = useState('')
  const [notes, setNotes] = useState('')

  const fetchData = async () => {
    const { data: cardData } = await supabase.from('kamishibai_cards').select('*')
    const { data: submissionData } = await supabase.from('submissions').select('*').order('created_at', { ascending: false })

    const userIds = [...new Set((submissionData ?? []).map((s) => s.user_id).filter(Boolean))] as string[]
    const { data: userData } = await supabase
      .from('users_view')
      .select('id, display_name')
      .in('id', userIds)

    const nameMap = Object.fromEntries((userData ?? []).map((u) => [u.id, u.display_name || 'Unknown']))

    setCards(cardData || [])
    setSubmissions(submissionData || [])
    setDisplayNames(nameMap)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async () => {
    if (!selectedCard || !status || !notes) return

    await supabase.from('submissions').insert({
      card_id: selectedCard,
      status,
      notes,
    })

    await fetchData()
    setSelectedCard('')
    setStatus('')
    setNotes('')
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">Submissions</h1>

      <div className="flex gap-2 mb-4">
        <select
          className="border rounded p-2"
          value={selectedCard}
          onChange={(e) => setSelectedCard(e.target.value)}
        >
          <option value="">Select Card</option>
          {cards.map((card) => (
            <option key={card.id} value={card.id}>{card.uid}</option>
          ))}
        </select>

        <select
          className="border rounded p-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Select Status</option>
          <option value="passed">Passed</option>
          <option value="failed">Failed</option>
        </select>

        <input
          className="border rounded p-2 flex-1"
          type="text"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          Submit
        </button>
      </div>

      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Card UID</th>
            <th className="p-2">Status</th>
            <th className="p-2">Notes</th>
            <th className="p-2">Submitted By</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="p-2">{cards.find(c => c.id === s.card_id)?.uid || 'Unknown'}</td>
              <td className="p-2 capitalize">{s.status}</td>
              <td className="p-2">{s.notes}</td>
              <td className="p-2">{displayNames[s.user_id || ''] || 'Unknown'}</td>
              <td className="p-2">{new Date(s.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
