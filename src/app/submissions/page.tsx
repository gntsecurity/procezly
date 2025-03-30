'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '../../utils/supabase/client'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/ui/select'

type Submission = {
  id: string
  user_id: string
  card_id: string
  status: string
  notes: string
  created_at: string
}

type Card = {
  id: string
  uid: string
}

export default function SubmissionsPage() {
  const supabase = createClientComponentClient()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [users, setUsers] = useState<Record<string, string>>({})
  const [selectedCard, setSelectedCard] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [notes, setNotes] = useState('')
  const [uid, setUid] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      setUid(user.id)

      const { data: roleData } = await supabase
        .from('roles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      setIsAdmin(roleData?.role === 'admin')

      const { data: cardData } = await supabase
        .from('kamishibai_cards')
        .select('id, uid')

      const { data: submissionData } = await supabase
        .from('submissions')
        .select('*')

      const { data: authData } = await supabase.auth.admin.listUsers()
      const userMap = Object.fromEntries(
        authData.users.map((u) => [
          u.id,
          u.user_metadata?.display_name || 'Unknown',
        ])
      )

      const filtered = isAdmin
        ? submissionData || []
        : (submissionData || []).filter((s) => s.user_id === user.id)

      setCards(cardData || [])
      setUsers(userMap)
      setSubmissions(filtered)
    }

    fetchData()
  }, [supabase, uid, isAdmin])

  const handleSubmit = async () => {
    if (!selectedCard || !selectedStatus) return

    await supabase.from('submissions').insert({
      user_id: uid,
      card_id: selectedCard,
      status: selectedStatus,
      notes,
    })

    location.reload()
  }

  const cardMap = Object.fromEntries(cards.map((c) => [c.id, c.uid]))

  return (
    <div className="p-6">
      <h1 className="text-lg font-bold mb-4">Submissions</h1>
      <div className="flex gap-2 mb-4">
        <Select onValueChange={setSelectedCard}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Card" />
          </SelectTrigger>
          <SelectContent>
            {cards.map((card) => (
              <SelectItem key={card.id} value={card.id}>
                {card.uid}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Passed">Passed</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Notes"
          className="w-[300px]"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button onClick={handleSubmit}>Submit</Button>
      </div>

      <table className="w-full text-left text-sm border">
        <thead>
          <tr className="border-b">
            <th className="p-2">Card UID</th>
            <th className="p-2">Status</th>
            <th className="p-2">Notes</th>
            <th className="p-2">Submitted By</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s) => (
            <tr key={s.id} className="border-b">
              <td className="p-2">{cardMap[s.card_id]}</td>
              <td className="p-2">{s.status}</td>
              <td className="p-2">{s.notes}</td>
              <td className="p-2">{users[s.user_id] || 'Unknown'}</td>
              <td className="p-2">
                {new Date(s.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
