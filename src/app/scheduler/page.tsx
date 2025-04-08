'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useDrop, useDrag, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { GripVertical } from 'lucide-react'

interface Card {
  id: string
  uid: string
  audit_phase: string
}

const phases = ['Planned', 'In Progress', 'Complete']

const SchedulerPage = () => {
  const { user, isSignedIn, isLoaded } = useUser()
  const [cardsByPhase, setCardsByPhase] = useState<Record<string, Card[]>>({
    Planned: [],
    'In Progress': [],
    Complete: [],
  })

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    const load = async () => {
      const roleRes = await fetch(`/functions/api/roles?user_id=${user.id}`)
      const roleData = await roleRes.json()
      const orgId = roleData.organization_id

      const cardRes = await fetch(`/functions/api/kamishibai-cards?organization_id=${orgId}`)
      const allCards: Card[] = await cardRes.json()

      const grouped: Record<string, Card[]> = {
        Planned: [],
        'In Progress': [],
        Complete: [],
      }

      for (const card of allCards) {
        const phase = card.audit_phase || 'Planned'
        grouped[phase].push(card)
      }

      setCardsByPhase(grouped)
    }

    load()
  }, [isLoaded, isSignedIn, user])

  const moveCard = async (card: Card, toPhase: string) => {
    if (card.audit_phase === toPhase) return

    await fetch('/functions/api/kamishibai-cards', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: card.id, audit_phase: toPhase }),
    })

    setCardsByPhase((prev) => {
      const updated = { ...prev }
      updated[card.audit_phase] = updated[card.audit_phase].filter((c) => c.id !== card.id)
      updated[toPhase] = [...updated[toPhase], { ...card, audit_phase: toPhase }]
      return updated
    })
  }

  if (!isLoaded || !isSignedIn) return null

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="px-4 pt-6 sm:px-6 w-full max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Audit Scheduler</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {phases.map((phase) => (
            <PhaseColumn
              key={phase}
              phase={phase}
              cards={cardsByPhase[phase]}
              onDropCard={moveCard}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  )
}

const PhaseColumn = ({
  phase,
  cards,
  onDropCard,
}: {
  phase: string
  cards: Card[]
  onDropCard: (card: Card, toPhase: string) => void
}) => {
  const [{ isOver }, dropRef] = useDrop({
    accept: 'CARD',
    drop: (item: Card) => onDropCard(item, phase),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  return dropRef(
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 min-h-[300px] transition ${
        isOver ? 'bg-blue-50' : ''
      }`}
    >
      <h2 className="text-lg font-semibold mb-3 text-gray-700">{phase}</h2>
      {cards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  )
}

const CardItem = ({ card }: { card: Card }) => {
  const [, dragRef] = useDrag({
    type: 'CARD',
    item: card,
  })

  return dragRef(
    <div className="bg-gray-100 border border-gray-300 rounded px-3 py-2 mb-2 flex items-center justify-between">
      <span className="text-sm font-medium text-gray-800">{card.uid}</span>
      <GripVertical className="text-gray-500" size={16} />
    </div>
  )
}

export default SchedulerPage
