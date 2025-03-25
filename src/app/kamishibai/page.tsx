"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { Pencil, Trash2, Plus } from "lucide-react";

interface KamishibaiCard {
  id: string;
  uid: string;
  name: string;
  description: string;
  department_owner: string;
}

const KamishibaiPage = () => {
  const [cards, setCards] = useState<KamishibaiCard[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orgId, setOrgId] = useState<string | null>(null);

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

  if (orgId) orgId.toString();

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this card?")) return;
    await supabase.from("kamishibai_cards").delete().eq("id", id);
    setCards(cards.filter((card) => card.id !== id));
  };

  return (
    <div className="px-4 pt-6 sm:px-6 w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Kamishibai Cards</h1>
        {isAdmin && (
          <button className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition">
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
                    <button className="text-blue-600 hover:text-blue-800">
                      <Pencil size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(card.id)}
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
    </div>
  );
};

export default KamishibaiPage;
