'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { ShieldCheck, ClipboardList, Users, FileCheck2, Timer } from 'lucide-react'

export default function CompliancePage() {
  const { user, isSignedIn, isLoaded } = useUser()
  const [orgId, setOrgId] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    const init = async () => {
      const roleRes = await fetch(`/functions/api/roles?user_id=${user.id}`)
      const roleData = await roleRes.json()

      if (!roleData) return

      setOrgId(roleData.organization_id)
    }

    init()
  }, [isLoaded, isSignedIn, user])

  if (!isLoaded || !isSignedIn) return null

  return (
    <div className="px-4 pt-6 sm:px-6 w-full max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Compliance & Auditing</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Why Compliance Matters</h2>
        <p className="text-gray-700 leading-relaxed">
          Compliance reduces risk and ensures your organization meets internal standards and
          external regulations. Whether pursuing ISO certification or internal accountability,
          it&apos;s the foundation of operational trust.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Kamishibai Auditing</h2>
        <p className="text-gray-700">
          A lean auditing method developed at Toyota, Kamishibai ensures recurring visual
          audits using rotating cards. It embeds quality and accountability directly into your
          daily operations.
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          <li>Rotating card-based checks</li>
          <li>Cross-functional accountability</li>
          <li>Actionable, fast feedback loops</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">ISO Alignment</h2>
        <div className="flex flex-wrap gap-3 mt-2">
          <Badge label="ISO 9001" href="https://www.iso.org/iso-9001-quality-management.html" />
          <Badge label="ISO 27001" href="https://www.iso.org/isoiec-27001-information-security.html" />
          <Badge label="ISO 45001" href="https://www.iso.org/iso-45001-occupational-health-and-safety.html" />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Audit Lifecycle</h2>
        <div className="space-y-4">
          <TimelineItem icon={<ClipboardList />} title="Create Audit Cards" />
          <TimelineItem icon={<Users />} title="Assign Responsibility" />
          <TimelineItem icon={<Timer />} title="Run Scheduled Audits" />
          <TimelineItem icon={<FileCheck2 />} title="Submit & Review" />
          <TimelineItem icon={<ShieldCheck />} title="Prove Compliance" />
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-blue-800">
        <p className="font-medium">Ready to take control of your audits?</p>
        <p>
          Use the{" "}
          <Link href="/scheduler" className="underline font-semibold">
            Audit Scheduler
          </Link>{" "}
          to visually manage your Kamishibai board.
        </p>
      </div>
    </div>
  )
}

function Badge({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="px-3 py-1 rounded-full bg-gray-100 border text-sm font-medium text-gray-800 hover:bg-gray-200"
    >
      {label}
    </Link>
  )
}

function TimelineItem({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="bg-blue-100 text-blue-700 rounded-full p-2">{icon}</div>
      <span className="text-gray-800 font-medium">{title}</span>
    </div>
  )
}
