"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Submission {
  id: string;
  card_id: string;
  status: string;
  submitted_at: string;
}

interface Card {
  id: string;
  uid: string;
}

const CompliancePage = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
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

      const [{ data: sub }, { data: cardData }] = await Promise.all([
        supabase
          .from("submissions")
          .select("id, card_id, status, submitted_at")
          .eq("organization_id", roleData.organization_id),
        supabase
          .from("kamishibai_cards")
          .select("id, uid")
          .eq("organization_id", roleData.organization_id),
      ]);

      setSubmissions(sub || []);
      setCards(cardData || []);
    };

    init();
  }, []);

  const total = submissions.length;
  const passed = submissions.filter((s) => s.status === "Passed").length;
  const failed = submissions.filter((s) => s.status === "Failed").length;
  const attention = submissions.filter((s) => s.status === "Needs Attention").length;

  const score = total > 0 ? Math.round((passed / total) * 100) : 0;

  const cardMap = Object.fromEntries(cards.map((c) => [c.id, c.uid]));

  const groupedByCard = submissions.reduce((acc: Record<string, any>, sub) => {
    const name = cardMap[sub.card_id] || "Unknown";
    if (!acc[name]) acc[name] = { name, Passed: 0, Failed: 0, "Needs Attention": 0 };
    acc[name][sub.status] += 1;
    return acc;
  }, {});
  const chartData = Object.values(groupedByCard);

  return (
    <div className="px-4 pt-6 sm:px-6 w-full max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Compliance Overview</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Overall Score" value={`${score}%`} />
        <StatCard label="Total Submissions" value={total.toString()} />
        <StatCard label="Passed / Failed / Needs Attention" value={`${passed} / ${failed} / ${attention}`} />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Submissions by Card</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Passed" stackId="a" />
            <Bar dataKey="Failed" stackId="a" />
            <Bar dataKey="Needs Attention" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4">
    <div className="text-gray-500 text-sm">{label}</div>
    <div className="text-xl font-semibold text-gray-800">{value}</div>
  </div>
);

export default CompliancePage;
