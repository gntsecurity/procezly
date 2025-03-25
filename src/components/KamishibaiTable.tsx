"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { Pencil, Trash2, Plus, X } from "lucide-react";

interface KamishibaiCard {
  id?: string;
  uid: string;
  name: string;
  description: string;
  department_owner: string;
}

const KamishibaiPage = () => {
  const [cards, setCards] = useState<KamishibaiCard[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<KamishibaiCard>({
    uid: "",
    name: "",
    description: "",
    department_owner: "",
  });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) return;

      const { data: roleData } = await supabase
        .from("roles")
        .select("role, organization_id")
        .eq("user_id", user.user.id)
        .single();

      if (!roleData) return;

      setIsAdmin(roleData.role === "admin");
      setOrgId(roleData.organization_id);

      const { data: cards } = await supabase
        .from("kamishibai_cards")
        .select("*")
        .eq("organization_id", roleData.organization_id)
        .order("created_at", { ascending: false });

      setCards(cards || []);
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this card?")) return;
    await supabase.from("kamishibai_cards").delete().eq("id", id);
    setCards(cards.filter((card) => card.id !== id));
  };

  const openModal = (card?: KamishibaiCard) => {
    if (card) {
      setFormData(card);
      setEditId(card.id || null);
    } else {
      setFormData({ uid: "", name: "", description: "", department_owner: "" });
      setEditId(null);
    }
    setModalOpen(true);
  };

  const saveCard = async () => {
    if (!orgId) return;

    const payload = {
      ...formData,
      organization_id: orgId,
    };

    if (editId) {
      await supabase.from("kamishibai_cards").update(payload).eq("id", editId);
    } else {
      await supabase.from("kamishibai_cards").insert(payload);
    }

    setModalOpen(false);
    setFormData({ uid: "", name: "", description: "", department_owner: "" });
    setEditId(null);

    const { data: updated } = await supabase
      .from("kamishibai_cards")
      .select("*")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false });

    setCards(updated || []);
  };

  return (
    <div className="px-4 pt-6 sm:px-6 w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Kamishibai Cards</h1>
        {isAdmin && (
          <button
            onClick={() => openModal()}
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
              <th className="px-4 py-2 text-left text-gray-600">Name</th>
              <th className="px-4 py-2 text-left text-gray-600">Department Owner</th>
              <th className="px-4 py-2 text-left text-gray-600">Description</th>
              {isAdmin && <th className="px-4 py-2 text-right text-gray-600">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => (
              <tr key={card.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-900">{card.uid}</td>
                <td className="px-4 py-2 text-gray-900">{card.name}</td>
                <td className="px-4 py-2 text-gray-900">{card.department_owner}</td>
                <td className="px-4 py-2 text-gray-900">{card.description}</td>
                {isAdmin && (
                  <td className="px-4 py-2 text-right space-x-2">
                    <button className="text-blue-600 hover:text-blue-800" onClick={() => openModal(card)}>
                      <Pencil size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(card.id!)}
                    >
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
          <div className="bg-white rounded-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4">{editId ? "Edit Card" : "Add New Card"}</h2>
            <div className="space-y-4">
              <input
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="UID"
                value={formData.uid}
                onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
              />
              <input
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Department Owner"
                value={formData.department_owner}
                onChange={(e) => setFormData({ ...formData, department_owner: e.target.value })}
              />
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={saveCard}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KamishibaiPage;
