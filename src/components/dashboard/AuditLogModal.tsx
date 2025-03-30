'use client'

import { X } from 'lucide-react'

export default function AuditLogModal({
  logs,
  onClose,
}: {
  logs: { action: string; timestamp: string }[]
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold mb-4">Recent Audit Logs</h2>
        <ul className="text-sm text-gray-800 space-y-2">
          {logs.map((log, idx) => (
            <li key={idx} className="border-b pb-2">
              <div>{log.action}</div>
              <div className="text-xs text-gray-500">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
