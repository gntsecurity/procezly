"use client";

import Navbar from "../components/Navbar";
import FauxDashboard from "../components/FauxDashboard";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";

export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });

  const bgShift = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  // ✅ Fix: Ensure the page loads at the top smoothly
  useEffect(() => {
    setTimeout(() => window.scrollTo(0, 0), 100);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 relative overflow-x-hidden">
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
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <h1 className="text-6xl md:text-7xl font-extrabold leading-[1.1] text-gray-900">
              The Future of <span className="text-blue-600">Kamishibai Auditing</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-xl">
              AI-powered compliance automation with real-time monitoring, digital workflows, and enterprise-grade security—built for precision manufacturing.
            </p>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="w-full flex flex-col space-y-4"
          >
            {[
              "Digital Audit Logs",
              "Automated Workflows",
              "Enterprise-Grade Security",
              "AI-Powered Analytics",
            ].map((label, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-4 p-6 bg-white shadow-md rounded-xl transition-transform"
              >
                <p className="text-lg font-semibold text-gray-900">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Real-Time Compliance Insights */}
      <section ref={ref} className="w-full max-w-[1400px] px-6 md:px-12 py-40 mx-auto space-y-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-6xl font-bold text-center text-gray-900"
        >
          Real-Time <span className="text-blue-600">Compliance Insights</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-[1200px] mx-auto shadow-lg rounded-xl overflow-hidden bg-white p-6"
        >
          <FauxDashboard />
        </motion.div>
      </section>
    </div>
  );
}
