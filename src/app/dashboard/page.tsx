'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../utils/supabaseClient'
import {
  ClipboardList,
  ShieldCheck,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  BarChart2,
  X
} from 'lucide-react'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalCards: 0,
    activeUsers: 0,
    complianceScore: 0,
    recentActions: [] as { action: string; timestamp: string }[],
    role: '',
  })

  const [userName, setUserName] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [logHistory, setLogHistory] = useState<
    { action: string; timestamp: string }[]
  >([])
  const [chartData, setChartData] = useState<number[]>([])

  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session) {
        window.location.href = '/login'
        return
      }
      setIsAuthenticated(true)
    }

    const fetchData = async () => {
      const { data: user, error: userError } = await supabase.auth.getUser()
      if (userError || !user?.user?.id) return

      const fullName = user.user.user_metadata?.full_name
      setUserName(fullName || user.user.email?.split('@')[0] || 'there')

      const { data: roleData } = await supabase
        .from('roles')
        .select('organization_id, role')
        .eq('user_id', user.user.id)
        .single()

      if (!roleData) return

      const orgId = roleData.organization_id

      const [cards, users, submissions, logs] = await Promise.all([
        supabase.from('kamishibai_cards').select('*').eq('organization_id', orgId),
        supabase.from('roles').select('user_id').eq('organization_id', orgId),
        supabase.from('submissions').select('submitted_at').eq('organization_id', orgId),
        supabase
          .from('audit_logs')
          .select('action, timestamp')
          .eq('organization_id', orgId)
          .order('timestamp', { ascending: false })
          .limit(5),
      ])

      const fullLogs = await supabase
        .from('audit_logs')
        .select('action, timestamp')
        .eq('organization_id', orgId)
        .order('timestamp', { ascending: false })
        .limit(50)

      const submissionTimestamps = submissions.data?.map((s) => s.submitted_at) || []
      const past7 = Array(7).fill(0)

      submissionTimestamps.forEach((ts) => {
        const dayDiff = Math.floor(
          (Date.now() - new Date(ts).getTime()) / (1000 * 60 * 60 * 24)
        )
        if (dayDiff >= 0 && dayDiff < 7) past7[6 - dayDiff]++
      })

      setChartData(past7)
      setLogHistory(fullLogs.data || [])

      setDashboardData({
        totalCards: cards.data?.length || 0,
        activeUsers: users.data?.length || 0,
        complianceScore: submissions.data?.length
          ? Math.min(100, submissions.data.length * 3)
          : 0,
        recentActions: logs.data || [],
        role: roleData.role || '',
      })
    }

    checkAuth()
    fetchData()
    const interval = setInterval(fetchData, 120000)
    return () => clearInterval(interval)
  }, [])

  if (!isAuthenticated) return <div>Loading...</div>

  return (
    <div className="px-4 pt-4 sm:px-6 sm:pt-6 w-full max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-3xl font-semibold text-gray-900">
        Hey {userName}, welcome back 👋
      </h1>
      <p className="text-gray-600 text-sm sm:text-base mt-1">
        Your team is making progress! Here&apos;s the latest snapshot.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6 mt-6">
        <StatCard
          icon={<ClipboardList size={24} />}
          title="Kamishibai Cards"
          value={dashboardData.totalCards}
          onClick={() => router.push('/kamishibai')}
        />
        <StatCard
          icon={<Users size={24} className="text-indigo-600" />}
          title="Active Users"
          value={dashboardData.activeUsers}
          onClick={() => router.push('/settings')}
        />
        <StatCard
          icon={<ShieldCheck size={24} className="text-blue-600" />}
          title="Compliance Score"
          value={`${dashboardData.complianceScore}%`}
          onClick={() => router.push('/submissions')}
        />
        {dashboardData.role === 'admin' && (
          <StatCard
            icon={<Clock size={24} className="text-amber-600" />}
            title="Audit Logs"
            value={`${dashboardData.recentActions.length} Recent`}
            onClick={() => setModalOpen(true)}
          />
        )}
      </div>

      {dashboardData.recentActions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-medium text-gray-700 mb-2">
            Recent Activity
          </h2>
          <ul className="text-sm text-gray-600 space-y-1">
            {dashboardData.recentActions.map((log, i) => (
              <li key={i}>
                {log.action} –{' '}
                <span className="text-gray-400 text-xs">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Chart block */}
      <div className="mt-10 hidden xl:block">
        <div className="bg-white border rounded-lg p-5 shadow-sm w-full max-w-lg">
          <div className="flex items-center gap-4 mb-4">
            <BarChart2 className="text-purple-600" size={28} />
            <div>
              <div className="text-gray-500 text-sm">Submissions This Week</div>
            </div>
          </div>

          <svg width="100%" height="80" viewBox="0 0 210 80" className="text-purple-400">
            {chartData.map((val, idx) => (
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
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4">Recent Audit Logs</h2>
            <ul className="text-sm text-gray-800 space-y-2">
              {logHistory.map((log, idx) => (
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
      )}

      <div className="hidden">
        <AlertTriangle />
        <CheckCircle />
        <FileText />
      </div>
    </div>
  )
}

const StatCard = ({
  icon,
  title,
  value,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  value: string | number
  onClick: () => void
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white px-4 py-3 sm:p-6 rounded-lg shadow-sm flex items-center space-x-4 border border-gray-200 hover:shadow-md hover:scale-[1.01] transition"
    >
      <div className="p-2 sm:p-3 bg-gray-100 rounded-full">{icon}</div>
      <div className="flex flex-col justify-center">
        <p className="text-xs sm:text-sm text-gray-600">{title}</p>
        <p className="text-base sm:text-xl font-semibold text-gray-900">
          {value}
        </p>
      </div>
    </button>
  )
}

export default Dashboard
