'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../../components/Navbar'

export default function DemoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    industry: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/functions/api/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    setLoading(false)

    if (res.ok) {
      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        company: '',
        industry: '',
        message: '',
      })

      setTimeout(() => setSubmitted(false), 5000)
    } else {
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center px-6 md:px-12 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-4xl text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Book a Demo
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mt-4">
            Experience the future of compliance automation firsthand.
          </p>
        </motion.div>

        {/* Submission Success */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          className="max-w-4xl text-center mt-16"
        >
          <h2 className="text-2xl font-semibold">
            Trusted by Industry Leaders
          </h2>
          <p className="text-gray-600 mt-2">
            Join top organizations streamlining their compliance with Procezly.
          </p>
        </motion.div>

        {/* Form Section */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-3xl bg-white border border-gray-200 p-8 rounded-lg mt-8"
        >
          <h2 className="text-2xl font-semibold mb-4">Request a Demo</h2>

          {submitted && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
              <p>Thank you for your request! We’ll be in touch soon.</p>
            </div>
          )}

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 mt-4"
            required
          />
          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 mt-4"
            required
          />
          <input
            type="text"
            name="industry"
            placeholder="Industry"
            value={formData.industry}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 mt-4"
          />
          <textarea
            name="message"
            placeholder="Tell us about your compliance needs..."
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 mt-4"
            rows={4}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded-lg transition ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Sending...' : 'Request Demo'}
          </button>
        </motion.form>
      </main>
    </div>
  )
}
