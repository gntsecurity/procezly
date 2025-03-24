"use client";

import Navbar from "../components/Navbar";
import FauxDashboard from "../components/FauxDashboard";
import { ClipboardCheck, FileCheck, Workflow, ShieldCheck, BarChart3, Eye } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";

export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });

  const bgShift = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  // Ensure the page loads at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 relative overflow-hidden">
      <Navbar />

      {/* Background Gradient Effects */}
      <motion.div
        className="absolute inset-0 -z-10 overflow-hidden"
        style={{ y: bgShift }}
      >
        <div className="absolute top-0 left-1/4 w-[900px] h-[900px] bg-gradient-to-br from-blue-500/20 to-indigo-500/10 rounded-full blur-[180px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-gray-700/20 to-gray-500/10 rounded-full blur-[150px]"></div>
      </motion.div>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-12 pt-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-7xl font-extrabold tracking-tight leading-[1.1] text-gray-900">
              The Future of <span className="text-blue-600">Kamishibai Auditing</span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed max-w-xl">
              AI-powered compliance automation with real-time monitoring, digital workflows, and enterprise-grade security—built for precision manufacturing.
            </p>
          </motion.div>

          {/* Feature Highlights (Icons Only) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full flex flex-col space-y-6"
          >
            {[
              { icon: FileCheck, label: "Digital Audit Logs" },
              { icon: Workflow, label: "Automated Workflows" },
              { icon: ShieldCheck, label: "Enterprise-Grade Security" },
              { icon: BarChart3, label: "AI-Powered Analytics" },
            ].map(({ icon: Icon, label }, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-6 p-6 bg-white/50 backdrop-blur-md rounded-2xl shadow-xl transition-transform"
              >
                <Icon className="h-10 w-10 text-blue-600" />
                <p className="text-lg font-semibold text-gray-900">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Real-Time Compliance Insights */}
      <section ref={ref} className="w-full max-w-[1400px] px-12 py-40 mx-auto space-y-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-bold text-center text-gray-900"
        >
          Real-Time <span className="text-blue-600">Compliance Insights</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-[1200px] mx-auto shadow-xl rounded-2xl overflow-hidden border bg-white p-6"
        >
          <FauxDashboard />
        </motion.div>
      </section>

      {/* AI-Powered Call to Action (Restored) */}
      <section className="w-full max-w-[1400px] px-12 py-40 mx-auto text-center space-y-12 bg-gray-50 rounded-3xl shadow-lg">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-bold text-gray-900"
        >
          Transform Compliance with <span className="text-blue-600">AI-Powered Automation</span>
        </motion.h2>

        <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
          Save time, reduce risk, and streamline compliance audits with intelligent automation.
        </p>

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
          transition={{ duration: 0.3 }}
          className="px-10 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transition"
        >
          Request a Demo
        </motion.button>
      </section>
    </div>
  );
}
