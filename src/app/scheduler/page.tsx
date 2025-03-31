"use client";

import { useEffect, useState } from "react";
import { useDrop, useDrag, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { supabase } from "../../utils/supabaseClient";
import { GripVertical } from "lucide-react";

interface Card {
  id: string;
  uid: string;
  audit_phase: string;
}

const phases = ["Planned", "In Progress", "Complete"];

const SchedulerPage = () => {
  const [cardsByPhase, setCardsByPhase] = useState<Record<string, Card[]>>({
    Planned: [],
    "In Progress": [],
    Complete: [],
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const moveCard = async (card: Card, toPhase: string) => {
    if (card.audit_phase === toPhase) return;

    await supabase
      .from("kamishibai_cards")
      .update({ audit_phase: toPhase })
      .eq("id", card.id);

    setCardsByPhase((prev) => {
      const next = { ...prev };
      next[card.audit_phase] = next[card.audit_phase].filter((c) => c.id !== card.id);
      next[toPhase] = [...next[toPhase], { ...card, audit_phase: toPhase }];
      return next;
    });
  };

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
  );
};

const PhaseColumn = ({
  phase,
  cards,
  onDropCard,
}: {
  phase: string;
  cards: Card[];
  onDropCard: (card: Card, toPhase: string) => void;
}) => {
  const [{ isOver }, dropRef] = useDrop({
    accept: "CARD",
    drop: (item: Card) => onDropCard(item, phase),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={dropRef}
      className={`bg-white border border-gray-200 rounded-lg p-4 min-h-[300px] transition ${
        isOver ? "bg-blue-50" : ""
      }`}
    >
      <h2 className="text-lg font-semibold mb-3 text-gray-700">{phase}</h2>
      {cards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  );
};

const CardItem = ({ card }: { card: Card }) => {
  const [, dragRef] = useDrag({
    type: "CARD",
    item: card,
  });

  return (
    <div
      ref={dragRef}
      className="bg-gray-100 border border-gray-300 rounded px-3 py-2 mb-2 flex items-center justify-between"
    >
      <span className="text-sm font-medium text-gray-800">{card.uid}</span>
      <GripVertical className="text-gray-500" size={16} />
    </div>
  );
};

export default SchedulerPage;
