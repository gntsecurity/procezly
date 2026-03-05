"use client";

import { useEffect, useState } from "react";

type MeResponse =
  | { authenticated: false }
  | { authenticated: true; session: { tenantSlug: string; email: string; name: string } };

export default function Page() {
  const [state, setState] = useState<{ loading: boolean; me?: MeResponse }>({ loading: true });

  useEffect(() => {
    const run = async () => {
      const api = process.env.NEXT_PUBLIC_API_ORIGIN!;
      const res = await fetch(api + "/v1/me", { credentials: "include" });
      const json = (await res.json()) as MeResponse;
      setState({ loading: false, me: json });
    };
    run();
  }, []);

  if (state.loading) return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading...</div>;

  if (!state.me || state.me.authenticated === false) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full border rounded-lg p-6">
          <div className="text-lg font-semibold">Sign in required</div>
          <div className="mt-2 text-sm text-gray-700">
            Sign in uses Azure Entra ID. Login is initiated from your tenant subdomain.
          </div>
          <div className="mt-6 text-sm text-gray-700">
            Go to https://&lt;tenant&gt;.procezly.io and select Sign in.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <div className="font-semibold">Procezly</div>
          <div className="text-sm text-gray-700">{state.me.session.email}</div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Tenant: {state.me.session.tenantSlug}</h1>
        <p className="mt-3 text-gray-700">
          This is the enterprise foundation. Next modules: Org model, Kamishibai cards, plans, execution, and CAPA linkage.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border p-4">
            <div className="font-medium">Organization</div>
            <div className="text-sm text-gray-700 mt-1">Plants, areas, lines, processes.</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="font-medium">Kamishibai</div>
            <div className="text-sm text-gray-700 mt-1">Cards, plans, audits, evidence.</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="font-medium">Audit trail</div>
            <div className="text-sm text-gray-700 mt-1">Every change recorded and exportable.</div>
          </div>
        </div>
      </div>
    </main>
  );
}
