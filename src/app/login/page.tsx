'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) router.push('/dashboard')
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Simulated login endpoint — replace with real auth later
    const res = await fetch('/functions/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Login failed')
      setLoading(false)
      return
    }

    const { user_id, name, token } = await res.json()

    localStorage.setItem('auth_token', token)
    localStorage.setItem('user_id', user_id)
    localStorage.setItem('user_email', email)
    localStorage.setItem('user_name', name)

    router.push('/dashboard')
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <img
        src="/login-bg.webp"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-90"
      />

      <div className="absolute z-10 w-full flex justify-center md:justify-start md:w-auto top-6 left-0 md:left-6">
        <img src="/gnts_logo.png" alt="GNT Security" className="w-32 h-auto" />
      </div>

      <div className="relative z-10 bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 flex flex-col items-center">
        <img
          src="/logo.png"
          alt="Procezly Logo"
          className="w-16 h-16 mb-6 rounded-md shadow-md"
        />
        <h2 className="text-3xl font-bold text-center text-gray-900">Sign In</h2>
        <p className="text-gray-500 text-center mt-2">Access your Procezly dashboard</p>

        {error && <p className="text-red-600 text-sm text-center mt-4">{error}</p>}

        <form onSubmit={handleLogin} className="mt-6 space-y-6 w-full">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
