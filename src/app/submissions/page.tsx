"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { CheckCircle, Loader, Send } from "lucide-react";

interface Submission {
  id?: string;
  card_id: string;
  status: string;
  notes: string;
  submitted_at?: string;
  card_name?: string;
}

interface Card {
  id: string;
  area: string;
  uid: string;
}

const SubmissionsPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [form, setForm] = useState({ card_id: "", status: "", notes: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) return;

      const uid = user.user.id;
      setUserId(uid);

      const { data: roleData } = await supabase
        .from("roles")
        .select("role, organization_id")
        .eq("user_id", uid)
        .single();

      if (!roleData) return;

      setIsAdmin(roleData.role === "admin");
      setOrgId(roleData.organization_id);

      const { data: cardData } = await supabase
        .from("kamishibai_cards")
        .select("id, area, uid")
        .eq("organization_id", roleData.organization_id);

      setCards(cardData || []);

      const { data: submissionData } = await supabase
        .from("submissions")
        .select("*, kamishibai_cards(area, uid)")
        .eq("organization_id", roleData.organization_id)
        .order("submitted_at", { ascending: false });

      const withCardNames = (submissionData || []).map((s) => ({
        ...s,
        card_name: s.kamishibai_cards?.area || s.kamishibai_cards?.uid || "Unknown",
      }));

      setSubmissions(
        roleData.role === "admin"
          ? withCardNames
          : withCardNames.filter((s) => s.user_id === uid)
      );

      setLoading(false);
    };

    init();
  }, [isAdmin]);

  const handleSubmit = async () => {
    if (!orgId || !userId) return;

    const payload = {
      ...form,
      organization_id: orgId,
      user_id: userId,
      submitted_at: new Date().toISOString(),
    };

    await supabase.from("submissions").insert(payload);
    setForm({ card_id: "", status: "", notes: "" });

    const { data: updated } = await supabase
      .from("submissions")
      .select("*, kamishibai_cards(area, uid)")
      .eq("organization_id", orgId)
      .order("submitted_at", { ascending: false });

    const withCardNames = (updated || []).map((s) => ({
      ...s,
      card_name: s.kamishibai_cards?.area || s.kamishibai_cards?.uid || "Unknown",
    }));

    setSubmissions(
      isAdmin ? withCardNames : withCardNames.filter((s) => s.user_id === userId)
    );
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        <Loader className="animate-spin mr-2" />
        Loading...
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 sm:px-6 w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Submissions</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-3">New Submission</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <select
            value={form.card_id}
            onChange={(e) => setForm({ ...form, card_id: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select Card</option>
            {cards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.area || card.uid}
              </option>
            ))}
          </select>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select Status</option>
            <option value="Passed">Passed</option>
            <option value="Failed">Failed</option>
            <option value="Needs Attention">Needs Attention</option>
          </select>
          <input
            type="text"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Notes"
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!form.card_id || !form.status}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <Send size={18} className="mr-2" />
          Submit
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">Card</th>
              <th className="px-4 py-2 text-left text-gray-600">Status</th>
              <th className="px-4 py-2 text-left text-gray-600">Notes</th>
              <th className="px-4 py-2 text-left text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-900">{s.card_name}</td>
                <td className="px-4 py-2 text-gray-900">{s.status}</td>
                <td className="px-4 py-2 text-gray-900">{s.notes}</td>
                <td className="px-4 py-2 text-gray-900">
                  {new Date(s.submitted_at!).toLocaleString()}
                </td>
              </tr>
            ))}
            {submissions.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                  No submissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="hidden">
        <CheckCircle />
      </div>
    </div>
  );
};

export default SubmissionsPage;
