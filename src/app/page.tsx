"use client";

import Navbar from "../components/Navbar";
import FauxDashboard from "../components/FauxDashboard";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, FileText, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 relative overflow-hidden">
      <Navbar />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-40 space-y-32">
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
              Compliance automation with real-time monitoring, streamlined workflows, and enterprise-grade security—built for precision manufacturing.
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
            <div className="rounded-2xl shadow-xl bg-white border border-gray-200 p-8 space-y-6">
              {[
                { icon: <FileText className="w-5 h-5 text-blue-600" />, label: "Digital Audit Logs" },
                { icon: <Zap className="w-5 h-5 text-blue-600" />, label: "Automated Workflows" },
                { icon: <ShieldCheck className="w-5 h-5 text-blue-600" />, label: "Enterprise-Grade Security" },
                { icon: <BarChart3 className="w-5 h-5 text-blue-600" />, label: "Analytics & Insights" },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-full">
                    {item.icon}
                  </div>
                  <span className="text-gray-800 font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

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

        <section className="grid md:grid-cols-3 gap-12 border-t border-gray-200 pt-20">
          {[
            {
              title: "Streamlined Compliance",
              desc: "Automate audit scheduling, tracking, and documentation—freeing up your teams for what matters most.",
            },
            {
              title: "Built for Scale",
              desc: "From small teams to enterprise deployments, Procezly adapts to your compliance needs without friction.",
            },
            {
              title: "Secure by Design",
              desc: "Enterprise-grade security, role-based access controls, and audit trails built in from day one.",
            },
          ].map((block, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="space-y-4"
            >
              <h4 className="text-xl font-semibold">{block.title}</h4>
              <p className="text-gray-600">{block.desc}</p>
            </motion.div>
          ))}
        </section>

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
