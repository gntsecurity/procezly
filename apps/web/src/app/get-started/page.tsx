import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Access your tenant</h1>
        <p className="mt-3 text-gray-700">
          Use your organization subdomain. Example: angstrom.procezly.io
        </p>
        <div className="mt-8 rounded-lg border p-4">
          <div className="text-sm text-gray-700">
            Tenant subdomains require activation and domain verification before login is permitted.
          </div>
        </div>
        <div className="mt-10">
          <Link className="text-sm underline" href="/">Back</Link>
        </div>
      </div>
    </main>
  );
}
