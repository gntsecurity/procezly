'use client'

import { BarChart2 } from 'lucide-react'

export default function SubmissionChart({ data }: { data: number[] }) {
  return (
    <div className="bg-white border rounded-lg p-5 shadow-sm w-full max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <BarChart2 className="text-purple-600" size={28} />
        <div>
          <div className="text-gray-500 text-sm">Submissions This Week</div>
        </div>
      </div>

      <svg width="100%" height="80" viewBox="0 0 210 80" className="text-purple-400">
        {data.map((val, idx) => (
          <rect
            key={idx}
            x={idx * 30}
            y={80 - val * 8}
            width="20"
            height={val * 8}
            rx="3"
            className="fill-current"
          />
        ))}
      </svg>

      <div className="text-xs text-gray-500 mt-2 flex justify-between">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={i} className="w-[30px] text-center">
            {d}
          </span>
        ))}
      </div>
    </div>
  )
}
