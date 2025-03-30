"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useDroppable, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface Card {
  id: string;
  uid: string;
  title?: string;
  audit_phase: string;
}

const phases = ["Planned", "In Progress", "Complete"];

const SchedulerPage = () => {
  const [cardsByPhase, setCardsByPhase] = useState<Record<string, Card[]>>({
    Planned: [],
    "In Progress": [],
    Complete: [],
  });
  const [orgId, setOrgId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id) return;

      const { data: roleData } = await supabase
        .from("roles")
        .select("organization_id")
        .eq("user_id", user.id)
        .single();

      if (!roleData) return;
      setOrgId(roleData.organization_id);

      const { data } = await supabase
        .from("kamishibai_cards")
        .select("id, uid, audit_phase")
        .eq("organization_id", roleData.organization_id);

      const grouped = { Planned: [], "In Progress": [], Complete: [] } as Record<string, Card[]>;
      for (const card of data || []) {
        grouped[card.audit_phase || "Planned"].push(card);
      }
      setCardsByPhase(grouped);
    };

    init();
  }, []);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    let sourcePhase = "";
    let movedCard: Card | undefined;

    for (const phase of phases) {
      const idx = cardsByPhase[phase].findIndex((c) => c.id === active.id);
      if (idx > -1) {
        sourcePhase = phase;
        movedCard = cardsByPhase[phase][idx];
        break;
      }
    }

    if (!movedCard) return;

    const updated = { ...cardsByPhase };
    updated[sourcePhase] = updated[sourcePhase].filter((c) => c.id !== active.id);
    updated[over.id].push(movedCard);
    setCardsByPhase(updated);

    await supabase
      .from("kamishibai_cards")
      .update({ audit_phase: over.id })
      .eq("id", movedCard.id);
  };

  return (
    <div className="px-4 pt-6 sm:px-6 w-full max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Audit Scheduler</h1>
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {phases.map((phase) => (
            <PhaseColumn key={phase} id={phase} cards={cardsByPhase[phase]} />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

const PhaseColumn = ({ id, cards }: { id: string; cards: Card[] }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="bg-white border border-gray-200 rounded-lg p-4 min-h-[300px]">
      <h2 className="text-lg font-semibold mb-3 text-gray-700">{id}</h2>
      <SortableContext items={cards} strategy={verticalListSortingStrategy}>
        {cards.map((card) => (
          <CardItem key={card.id} id={card.id} uid={card.uid} />
        ))}
      </SortableContext>
    </div>
  );
};

const CardItem = ({ id, uid }: { id: string; uid: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-100 border border-gray-300 rounded px-3 py-2 mb-2 flex items-center justify-between"
    >
      <span className="text-sm font-medium text-gray-800">{uid}</span>
      <GripVertical className="text-gray-500" size={16} />
    </div>
  );
};

export default SchedulerPage;
