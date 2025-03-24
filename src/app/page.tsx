"use client";

import Navbar from "../components/Navbar";
import FauxDashboard from "../components/FauxDashboard";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 relative overflow-hidden">
      <Navbar />

      {/* Hero */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-40 space-y-32">
        {/* Section: Hero */}
        <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <h1 className="text-6xl md:text-7xl font-extrabold leading-tight">
              The Future of <span className="text-blue-600">Kamishibai Auditing</span>
            </h1>
            <p className="text-lg text-gray-700 max-w-xl">
              AI-powered compliance automation with real-time monitoring, digital workflows, and enterprise-grade security—built for precision manufacturing.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="/demo" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                Book a Demo
              </a>
              <a href="/login" className="px-6 py-3 border border-gray-400 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition">
                Log In
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="rounded-2xl shadow-lg bg-white/60 backdrop-blur-md border p-6">
              <ul className="space-y-4">
                {["Digital Audit Logs", "Automated Workflows", "Enterprise-Grade Security", "AI-Powered Analytics"].map((feature, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    <span className="text-gray-800 text-md">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </section>

        {/* Section: Live Dashboard Preview */}
        <section className="space-y-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold text-center"
          >
            Real-Time <span className="text-blue-600">Compliance Insights</span>
          </motion.h2>

          <FauxDashboard />
        </section>

        {/* Section: Call to Action */}
        <section className="text-center py-20 border-t border-gray-200">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-semibold"
          >
            Ready to streamline your audits?
          </motion.h3>
          <p className="text-gray-600 mt-4">
            Join manufacturers and security teams who trust Procezly to automate compliance.
          </p>
          <div className="mt-6 flex justify-center">
            <a href="/demo" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
              Book a Demo
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
