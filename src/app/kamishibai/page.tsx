'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Pencil, Trash2, Plus, X } from 'lucide-react'

interface KamishibaiCard {
  id: string
  uid: string
  area: string
  task: string
  tips?: string
  supporting_documents?: string
  non_conformance?: string
  responsible: string
  safety_concerns?: string
  modified_by?: string
  modified?: string
}

interface OrgUser {
  user_id: string
  display_name: string
}

const KamishibaiPage = () => {
  const { user, isSignedIn, isLoaded } = useUser()

  const [cards, setCards] = useState<KamishibaiCard[]>([])
  const [users, setUsers] = useState<OrgUser[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const [formData, setFormData] = useState<Omit<KamishibaiCard, 'id'>>({
    uid: '',
    area: '',
    task: '',
    tips: '',
    supporting_documents: '',
    non_conformance: '',
    responsible: '',
    safety_concerns: '',
    modified_by: '',
    modified: '',
  })

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    const fetchData = async () => {
      const uid = user.id
      const roleRes = await fetch(`/functions/api/roles?user_id=${uid}`)
      const roleData = await roleRes.json()

      const org = roleData.organization_id
      const admin = roleData.role === 'admin'
      setOrgId(org)
      setUserId(uid)
      setIsAdmin(admin)

      const [cardRes, userRes] = await Promise.all([
        fetch(`/functions/api/kamishibai-cards?organization_id=${org}`),
        fetch(`/functions/api/roles-by-org?organization_id=${org}`),
      ])

      setCards(await cardRes.json())
      setUsers(await userRes.json())
    }

    fetchData()
  }, [isLoaded, isSignedIn, user])

  const resetForm = () => {
    setEditId(null)
    setModalOpen(false)
    setFormData({
      uid: '',
      area: '',
      task: '',
      tips: '',
      supporting_documents: '',
      non_conformance: '',
      responsible: '',
      safety_concerns: '',
      modified_by: '',
      modified: '',
    })
  }

  const handleSave = async () => {
    if (!orgId || !userId) return

    const payload = {
      ...formData,
      organization_id: orgId,
      modified_by: userId,
      modified: new Date().toISOString(),
    }

    const method = editId ? 'PUT' : 'POST'
    const endpoint = editId
      ? `/functions/api/kamishibai-card?id=${editId}`
      : `/functions/api/kamishibai-card`

    await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const refreshed = await fetch(
      `/functions/api/kamishibai-cards?organization_id=${orgId}`
    )
    setCards(await refreshed.json())
    resetForm()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this card?')) return
    await fetch(`/functions/api/kamishibai-card?id=${id}`, {
      method: 'DELETE',
    })
    setCards(cards.filter((card) => card.id !== id))
  }

  const handleEdit = (card: KamishibaiCard) => {
    setEditId(card.id)
    setFormData({ ...card })
    setModalOpen(true)
  }

  if (!isLoaded || !isSignedIn) return null

  return (
    <div className="px-4 pt-6 sm:px-6 w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Kamishibai Cards</h1>
        {isAdmin && (
          <button
            onClick={() => {
              setEditId(null)
              setModalOpen(true)
            }}
            className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            <Plus size={16} className="mr-1" />
            Add Card
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">UID</th>
              <th className="px-4 py-2 text-left text-gray-600">Area</th>
              <th className="px-4 py-2 text-left text-gray-600">Task</th>
              <th className="px-4 py-2 text-left text-gray-600">Responsible</th>
              {isAdmin && <th className="px-4 py-2 text-right text-gray-600">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => (
              <tr key={card.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{card.uid}</td>
                <td className="px-4 py-2">{card.area}</td>
                <td className="px-4 py-2">{card.task}</td>
                <td className="px-4 py-2">
                  {users.find((u) => u.user_id === card.responsible)?.display_name || 'Unknown'}
                </td>
                {isAdmin && (
                  <td className="px-4 py-2 text-right space-x-2">
                    <button className="text-blue-600" onClick={() => handleEdit(card)}>
                      <Pencil size={18} />
                    </button>
                    <button className="text-red-600" onClick={() => handleDelete(card.id)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {cards.length === 0 && (
              <tr>
                <td
                  colSpan={isAdmin ? 5 : 4}
                  className="px-4 py-4 text-center text-gray-500"
                >
                  No cards found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
            <button onClick={resetForm} className="absolute top-3 right-3 text-gray-400">
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4">
              {editId ? 'Edit Card' : 'Add New Card'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                className="border px-3 py-2 rounded"
                placeholder="UID"
                value={formData.uid}
                onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
              />
              <input
                className="border px-3 py-2 rounded"
                placeholder="Area"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              />
              <select
                className="border px-3 py-2 rounded"
                value={formData.responsible}
                onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
              >
                <option value="">Select Responsible</option>
                {users.map((u) => (
                  <option key={u.user_id} value={u.user_id}>
                    {u.display_name}
                  </option>
                ))}
              </select>
              <input
                className="border px-3 py-2 rounded"
                placeholder="Tips"
                value={formData.tips}
                onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
              />
              <textarea
                className="border px-3 py-2 rounded sm:col-span-2"
                placeholder="Task"
                value={formData.task}
                onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              />
              <textarea
                className="border px-3 py-2 rounded sm:col-span-2"
                placeholder="Supporting Documents"
                value={formData.supporting_documents}
                onChange={(e) =>
                  setFormData({ ...formData, supporting_documents: e.target.value })
                }
              />
              <textarea
                className="border px-3 py-2 rounded sm:col-span-2"
                placeholder="Non-Conformance"
                value={formData.non_conformance}
                onChange={(e) =>
                  setFormData({ ...formData, non_conformance: e.target.value })
                }
              />
              <textarea
                className="border px-3 py-2 rounded sm:col-span-2"
                placeholder="Safety Concerns"
                value={formData.safety_concerns}
                onChange={(e) =>
                  setFormData({ ...formData, safety_concerns: e.target.value })
                }
              />
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button onClick={resetForm} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button
                onClick={handleSave}
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

export default KamishibaiPage
