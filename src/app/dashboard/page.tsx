'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
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
  const router = useRouter()
  const { user, isSignedIn, isLoaded } = useUser()

  const [dashboardData, setDashboardData] = useState({
    totalCards: 0,
    activeUsers: 0,
    complianceScore: 0,
    recentActions: [] as { action: string; timestamp: string }[],
    role: '',
  })

  const [userName, setUserName] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [logHistory, setLogHistory] = useState<
    { action: string; timestamp: string }[]
  >([])
  const [chartData, setChartData] = useState<number[]>([])

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      router.replace('/login')
      return
    }

    const userId = user.id
    const displayName = user.fullName || user.emailAddresses[0]?.emailAddress
    setUserName(displayName || 'there')

    const fetchData = async () => {
      const roleRes = await fetch(`/functions/api/roles?user_id=${userId}`)
      const roleData = await roleRes.json()
      const orgId = roleData.organization_id

      const [cardsRes, usersRes, submissionsRes, logsRes, fullLogsRes] =
        await Promise.all([
          fetch(`/functions/api/kamishibai-cards?organization_id=${orgId}`),
          fetch(`/functions/api/roles-by-org?organization_id=${orgId}`),
          fetch(`/functions/api/submissions?organization_id=${orgId}`),
          fetch(`/functions/api/audit-logs?organization_id=${orgId}&limit=5`),
          fetch(`/functions/api/audit-logs?organization_id=${orgId}&limit=50`),
        ])

      const cards = await cardsRes.json()
      const users = await usersRes.json()
      const submissions = await submissionsRes.json()
      const logs = await logsRes.json()
      const fullLogs = await fullLogsRes.json()

      const submissionTimestamps = submissions.map((s: any) => s.submitted_at)
      const past7 = Array(7).fill(0)
      submissionTimestamps.forEach((ts: string) => {
        const dayDiff = Math.floor(
          (Date.now() - new Date(ts).getTime()) / (1000 * 60 * 60 * 24)
        )
        if (dayDiff >= 0 && dayDiff < 7) past7[6 - dayDiff]++
      })

      setChartData(past7)
      setLogHistory(fullLogs)

      setDashboardData({
        totalCards: cards.length,
        activeUsers: users.length,
        complianceScore: submissions.length
          ? Math.min(100, submissions.length * 3)
          : 0,
        recentActions: logs,
        role: roleData.role || '',
      })
    }

    fetchData()
    const interval = setInterval(fetchData, 120000)
    return () => clearInterval(interval)
  }, [isSignedIn, isLoaded, user, router])

  if (!isLoaded || !isSignedIn) return <div>Loading...</div>

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

      {modalOpen && (
        <AuditLogModal logs={logHistory} onClose={() => setModalOpen(false)} />
      )}

      <div className="hidden">
        <AlertTriangle />
        <CheckCircle />
        <FileText />
      </div>
    </div>
  )
}

export default Dashboard
