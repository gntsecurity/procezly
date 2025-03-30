'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { Submission, Card } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type User = {
  id: string
  display_name: string
}

export default function SubmissionsPage() {
  const supabase = createClientComponentClient<Database>()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [users, setUsers] = useState<User[]>([])
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
        .maybeSingle()

      const admin = roleData?.role === 'admin'
      setIsAdmin(admin)

      const { data: cardsData } = await supabase
        .from('kamishibai_cards')
        .select('id, uid')
        .order('created_at', { ascending: true })

      const { data: submissionsData } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false })

      const filteredSubmissions = admin
        ? submissionsData || []
        : (submissionsData || []).filter((s) => s.user_id === user.id)

      const { data: usersData } = await supabase.auth.admin.listUsers()

      const userList: User[] = usersData.users.map((u) => ({
        id: u.id,
        display_name: u.user_metadata?.display_name || 'Unknown',
      }))

      setCards(cardsData || [])
      setUsers(userList)
      setSubmissions(filteredSubmissions)
    }

    fetchData()
  }, [])

  const handleSubmit = async () => {
    if (!selectedCard || !selectedStatus) return

    await supabase.from('submissions').insert([
      {
        user_id: uid,
        card_id: selectedCard,
        status: selectedStatus,
        notes,
      },
    ])

    setSelectedCard('')
    setSelectedStatus('')
    setNotes('')

    const { data: submissionsData } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false })

    const filteredSubmissions = isAdmin
      ? submissionsData || []
      : (submissionsData || []).filter((s) => s.user_id === uid)

    setSubmissions(filteredSubmissions)
  }

  const cardMap = Object.fromEntries(cards.map((c) => [c.id, c.uid]))
  const userMap = Object.fromEntries(users.map((u) => [u.id, u.display_name]))

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-4">Submissions</h1>
      <div className="border rounded p-4 mb-6">
        <h2 className="font-medium mb-2">New Submission</h2>
        <div className="flex gap-2 flex-wrap items-end">
          <Select value={selectedCard} onValueChange={setSelectedCard}>
            <SelectTrigger className="w-48">
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

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Passed">Passed</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Notes"
            className="w-64"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>

      <div className="border rounded">
        <div className="grid grid-cols-5 gap-2 p-2 border-b text-sm font-medium bg-gray-50">
          <div>Card UID</div>
          <div>Status</div>
          <div>Notes</div>
          <div>Submitted By</div>
          <div>Date</div>
        </div>
        {submissions.map((s) => (
          <div
            key={s.id}
            className="grid grid-cols-5 gap-2 p-2 border-b text-sm"
          >
            <div>{cardMap[s.card_id] || 'Unknown'}</div>
            <div>{s.status}</div>
            <div>{s.notes}</div>
            <div>{userMap[s.user_id] || 'Unknown'}</div>
            <div>{new Date(s.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubmissionsPage;
