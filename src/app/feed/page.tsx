'use client'

import { useEffect, useState, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { Loader } from 'lucide-react'

interface AuditLog {
  id: string
  action: string
  created_at: string
  metadata: Record<string, unknown>
  organization_id: string
}

export default function FeedPage() {
  const { user, isSignedIn, isLoaded } = useUser()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const feedRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (feedRef.current) {
        feedRef.current.scrollTop = feedRef.current.scrollHeight
      }
    })
  }

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    const init = async () => {
      const res = await fetch(`/functions/api/roles?user_id=${user.id}`)
      const roleData = await res.json()

      if (!roleData) return

      const logsRes = await fetch(
        `/functions/api/audit-logs?organization_id=${roleData.organization_id}&limit=50`
      )
      const initialLogs: AuditLog[] = await logsRes.json()

      setLogs(initialLogs)
      setLoading(false)
      scrollToBottom()

      const eventSource = new EventSource(`/functions/api/audit-log-stream?organization_id=${roleData.organization_id}`)
      eventSource.onmessage = (event) => {
        const entry: AuditLog = JSON.parse(event.data)
        setLogs((prev) => [entry, ...prev.slice(0, 49)])
        scrollToBottom()
      }
    }

    init()
  }, [isLoaded, isSignedIn, user])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        <Loader className="animate-spin mr-2" />
        Loading feed...
      </div>
    )
  }

  return (
    <div className="px-4 pt-6 sm:px-6 w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Audit Log Feed</h1>
      <div
        ref={feedRef}
        className="bg-white border border-gray-200 rounded-lg p-4 h-[400px] overflow-y-auto space-y-3"
      >
        {logs.map((log) => (
          <div
            key={log.id}
            className="text-sm text-gray-800 border-b border-gray-100 pb-2 last:border-b-0"
          >
            <span className="font-medium">{log.action}</span>
            <span className="text-gray-500 text-xs block">
              {new Date(log.created_at).toLocaleString()}
            </span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-sm text-gray-500 text-center pt-4">No logs yet.</div>
        )}
      </div>
    </div>
  )
}
