"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { Pencil, Trash2, Plus, X } from "lucide-react";

interface KamishibaiCard {
  id: string;
  uid: string;
  area: string;
  task: string;
  tips?: string;
  supporting_documents?: string;
  non_conformance?: string;
  responsible: string;
  safety_concerns?: string;
  modified_by?: string;
  modified?: string;
}

export default function KamishibaiPage() {
  const [cards, setCards] = useState<KamishibaiCard[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<KamishibaiCard, "id">>({
    uid: "",
    area: "",
    task: "",
    tips: "",
    supporting_documents: "",
    non_conformance: "",
    responsible: "",
    safety_concerns: "",
    modified_by: "",
    modified: "",
  });

  useEffect(() => {
    const fetchCards = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) return;

      const { data: role } = await supabase
        .from("roles")
        .select("role, organization_id")
        .eq("user_id", userData.user.id)
        .single();

      if (!role) return;

      setIsAdmin(role.role === "admin");
      setOrgId(role.organization_id);
      setUserId(userData.user.id);

      const { data: cardData } = await supabase
        .from("kamishibai_cards")
        .select("*")
        .eq("organization_id", role.organization_id)
        .order("modified", { ascending: false });

      setCards(cardData || []);
    };

    fetchCards();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this card?")) return;
    await supabase.from("kamishibai_cards").delete().eq("id", id);
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const handleEdit = (card: KamishibaiCard) => {
    setEditId(card.id);
    const { id, ...rest } = card;
    setFormData(rest);
    setModalOpen(true);
  };

  const resetForm = () => {
    setEditId(null);
    setModalOpen(false);
    setFormData({
      uid: "",
      area: "",
      task: "",
      tips: "",
      supporting_documents: "",
      non_conformance: "",
      responsible: "",
      safety_concerns: "",
      modified_by: "",
      modified: "",
    });
  };

  const handleSave = async () => {
    if (!orgId || !userId) return;

    const payload = {
      ...formData,
      organization_id: orgId,
      modified_by: userId,
      modified: new Date().toISOString(),
    };

    const { error } = editId
      ? await supabase.from("kamishibai_cards").update(payload).eq("id", editId)
      : await supabase.from("kamishibai_cards").insert(payload);

    if (error) {
      console.error("Error saving card:", error.message);
      return;
    }

    resetForm();

    const { data: refreshed } = await supabase
      .from("kamishibai_cards")
      .select("*")
      .eq("organization_id", orgId)
      .order("modified", { ascending: false });

    setCards(refreshed || []);
  };

  return (
    <div className="px-4 pt-6 sm:px-6 w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Kamishibai Cards</h1>
        {isAdmin && (
          <button
            onClick={() => {
              setEditId(null);
              setModalOpen(true);
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
                <td className="px-4 py-2 text-gray-900">{card.uid}</td>
                <td className="px-4 py-2 text-gray-900">{card.area}</td>
                <td className="px-4 py-2 text-gray-900">{card.task}</td>
                <td className="px-4 py-2 text-gray-900">{card.responsible}</td>
                {isAdmin && (
                  <td className="px-4 py-2 text-right space-x-2">
                    <button onClick={() => handleEdit(card)} className="text-blue-600 hover:text-blue-800">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(card.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {cards.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="px-4 py-4 text-center text-gray-500">
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
            <button onClick={resetForm} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4">{editId ? "Edit Card" : "Add New Card"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input className="border rounded px-3 py-2" placeholder="UID" value={formData.uid} onChange={(e) => setFormData({ ...formData, uid: e.target.value })} />
              <input className="border rounded px-3 py-2" placeholder="Area" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} />
              <input className="border rounded px-3 py-2" placeholder="Responsible" value={formData.responsible} onChange={(e) => setFormData({ ...formData, responsible: e.target.value })} />
              <input className="border rounded px-3 py-2" placeholder="Tips" value={formData.tips} onChange={(e) => setFormData({ ...formData, tips: e.target.value })} />
              <textarea className="border rounded px-3 py-2 col-span-1 sm:col-span-2" placeholder="Task" value={formData.task} onChange={(e) => setFormData({ ...formData, task: e.target.value })} />
              <textarea className="border rounded px-3 py-2 col-span-1 sm:col-span-2" placeholder="Supporting Documents" value={formData.supporting_documents} onChange={(e) => setFormData({ ...formData, supporting_documents: e.target.value })} />
              <textarea className="border rounded px-3 py-2 col-span-1 sm:col-span-2" placeholder="Non-Conformance" value={formData.non_conformance} onChange={(e) => setFormData({ ...formData, non_conformance: e.target.value })} />
              <textarea className="border rounded px-3 py-2 col-span-1 sm:col-span-2" placeholder="Safety Concerns" value={formData.safety_concerns} onChange={(e) => setFormData({ ...formData, safety_concerns: e.target.value })} />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={resetForm} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
