"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { Loader } from "lucide-react";

interface AuditLog {
  id: string;
  action: string;
  table_name: string;
  user_id: string;
  created_at: string;
}

const FeedPage = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id) return;
      setUserId(user.id);

      const { data: roleData } = await supabase
        .from("roles")
        .select("role, organization_id")
        .eq("user_id", user.id)
        .single();

      if (!roleData) return;

      setOrgId(roleData.organization_id);
      setIsAdmin(roleData.role === "admin");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const orgIdRef = roleData.organization_id;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userIdRef = user.id;

      const { data: logData } = await supabase
        .from("audit_logs")
        .select("*")
        .eq("organization_id", roleData.organization_id)
        .order("created_at", { ascending: false })
        .limit(50);

      setLogs(logData || []);
      setLoading(false);

      supabase
        .channel("audit-feed")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "audit_logs" },
          (payload) => {
            const entry = payload.new as AuditLog;
            if (entry.organization_id === roleData.organization_id) {
              setLogs((prev) => [entry, ...prev.slice(0, 49)]);
              scrollToBottom();
            }
          }
        )
        .subscribe();
    };

    init();
  }, []);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        <Loader className="animate-spin mr-2" />
        Loading...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="px-4 pt-6 sm:px-6 w-full max-w-4xl mx-auto text-red-600">
        You do not have permission to view the audit feed.
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 sm:px-6 w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Audit Feed</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-4 h-[600px] overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-gray-500">No activity yet.</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="border-b py-2 text-sm">
              <span className="font-medium text-gray-800">{log.action}</span>{" "}
              on <span className="text-gray-700">{log.table_name}</span> by{" "}
              <span className="text-gray-600">{log.user_id}</span>{" "}
              <span className="text-gray-500">({new Date(log.created_at).toLocaleString()})</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default FeedPage;
