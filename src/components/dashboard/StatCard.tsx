'use client'

interface StatCardProps {
  icon: React.ReactNode
  title: string
  value: string | number
  onClick: () => void
}

export default function StatCard({ icon, title, value, onClick }: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white px-4 py-3 sm:p-6 rounded-lg shadow-sm flex items-center space-x-4 border border-gray-200 hover:shadow-md hover:scale-[1.01] transition"
    >
      <div className="p-2 sm:p-3 bg-gray-100 rounded-full">{icon}</div>
      <div className="flex flex-col justify-center">
        <p className="text-xs sm:text-sm text-gray-600">{title}</p>
        <p className="text-base sm:text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </button>
  )
}
