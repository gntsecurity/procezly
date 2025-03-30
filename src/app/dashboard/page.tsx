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
} from 'lucide-react'

import StatCard from '../../components/dashboard/StatCard'
import SubmissionChart from '../../components/dashboard/SubmissionChart'
import AuditLogModal from '../../components/dashboard/AuditLogModal'

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
    <div className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-12 w-full max-w-7xl mx-auto">
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
      <div className="mt-10 hidden xl:block">
        <SubmissionChart data={chartData} />
      </div>

      {modalOpen && <AuditLogModal logs={logHistory} onClose={() => setModalOpen(false)} />}

      <div className="hidden">
        <AlertTriangle />
        <CheckCircle />
        <FileText />
      </div>
    </div>
  )
}

export default Dashboard
