import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <div className="font-semibold tracking-tight">Procezly</div>
          <nav className="flex gap-4 text-sm">
            <Link href="/platform">Platform</Link>
            <Link href="/security">Security</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16 flex-1">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold leading-tight">
            Automotive Quality Management System built for audit reality
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            An end-to-end QMS with a first-class Kamishibai layered process audit engine, evidence integrity, and
            enterprise-grade tenancy.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="px-5 py-3 rounded-md bg-black text-white text-sm" href="/get-started">
              Get started
            </Link>
            <Link className="px-5 py-3 rounded-md border text-sm" href="/platform">
              See the platform
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border p-4">
              <div className="font-medium">Record integrity</div>
              <div className="text-sm text-gray-700 mt-1">Immutable audit trail, evidence links, export packs.</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="font-medium">Kamishibai engine</div>
              <div className="text-sm text-gray-700 mt-1">Risk-weighted schedules, missed-audit escalation.</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="font-medium">Tenant isolation</div>
              <div className="text-sm text-gray-700 mt-1">Subdomain tenancy with Azure domain verification gates.</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-gray-600">
          Procezly
        </div>
      </footer>
    </main>
  );
}
