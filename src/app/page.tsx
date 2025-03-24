"use client";

import Navbar from "../components/Navbar";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Footer from "../components/Footer";
import FauxDashboard from "../components/FauxDashboard";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";

export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });

  const bgShift = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  useEffect(() => {
    setTimeout(() => window.scrollTo(0, 0), 100);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 relative overflow-hidden">
      <Navbar />

      <motion.div className="absolute inset-0 -z-10 overflow-hidden" style={{ y: bgShift }}>
        <div className="absolute top-0 left-1/4 w-[900px] h-[900px] bg-gradient-to-br from-blue-500/20 to-indigo-500/10 rounded-full blur-[180px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-gray-700/20 to-gray-500/10 rounded-full blur-[150px]"></div>
      </motion.div>

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="space-y-8">
            <h1 className="text-7xl font-extrabold tracking-tight leading-[1.1] text-gray-900">
              The Future of <span className="text-blue-600">Kamishibai Auditing</span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed max-w-xl">
              AI-powered compliance automation with real-time monitoring, digital workflows, and enterprise-grade security—built for precision manufacturing.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }} className="w-full flex flex-col space-y-6">
            {["Digital Audit Logs", "Automated Workflows", "Enterprise-Grade Security", "AI-Powered Analytics"].map((label, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05 }} className="flex items-center space-x-6 p-6 bg-white/50 backdrop-blur-md rounded-2xl shadow-xl transition-transform">
                <p className="text-lg font-semibold text-gray-900">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      <section ref={ref} className="w-full max-w-[1400px] px-6 md:px-12 py-40 mx-auto space-y-16">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-6xl font-bold text-center text-gray-900">
          Real-Time <span className="text-blue-600">Compliance Insights</span>
        </motion.h2>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="w-full max-w-[1200px] mx-auto shadow-xl rounded-2xl overflow-hidden border bg-white p-6">
          <FauxDashboard />
        </motion.div>
      </section>
      <Footer/>
    </div>
  );
}
