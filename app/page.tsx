"use client";

import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import { ClipboardCheck, FileCheck, Workflow, ShieldCheck, BarChart3, Eye } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 relative">
      <Navbar />

      {/* Background Gradient Effects for High-End Look */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[900px] h-[900px] bg-gradient-to-br from-blue-500/10 to-indigo-500/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-gray-700/10 to-gray-500/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-12 pt-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <h1 className="text-7xl font-extrabold tracking-tight leading-[1.1] text-gray-900">
              The Future of <span className="text-blue-600">Kamishibai Auditing</span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed max-w-xl">
              AI-powered compliance automation with **real-time monitoring, digital workflows, and enterprise-grade security**—built for precision manufacturing.
            </p>
          </div>

          {/* Feature Highlights - No Boxed Cards, Only Structured Layout */}
          <div className="w-full flex flex-col space-y-6">
            <div className="flex items-center space-x-6 p-6 bg-white rounded-2xl shadow-xl">
              <FileCheck className="h-10 w-10 text-blue-600" />
              <p className="text-lg font-semibold text-gray-900">Digital Audit Logs</p>
            </div>
            <div className="flex items-center space-x-6 p-6 bg-white rounded-2xl shadow-xl">
              <Workflow className="h-10 w-10 text-blue-600" />
              <p className="text-lg font-semibold text-gray-900">Automated Workflows</p>
            </div>
            <div className="flex items-center space-x-6 p-6 bg-white rounded-2xl shadow-xl">
              <ShieldCheck className="h-10 w-10 text-blue-600" />
              <p className="text-lg font-semibold text-gray-900">Enterprise-Grade Security</p>
            </div>
            <div className="flex items-center space-x-6 p-6 bg-white rounded-2xl shadow-xl">
              <BarChart3 className="h-10 w-10 text-blue-600" />
              <p className="text-lg font-semibold text-gray-900">AI-Powered Analytics</p>
            </div>
          </div>
        </div>
      </main>

      {/* Why Procezly Section - No More Boxed Cards, Just High-End Flow */}
      <section className="w-full max-w-[1400px] px-12 py-40 mx-auto space-y-24">
        <h2 className="text-6xl font-bold text-center">Why Modern Manufacturing Chooses Procezly</h2>

        {/* Feature Block 1 - Left-Aligned */}
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="w-16 h-16 flex items-center justify-center bg-blue-600 rounded-xl">
            <ClipboardCheck className="h-10 w-10 text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-gray-900">Automated Scheduling</h3>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl">
              Never miss an audit again—intelligent scheduling assigns and tracks compliance in real time.
            </p>
          </div>
        </div>

        {/* Feature Block 2 - Right-Aligned */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="w-16 h-16 flex items-center justify-center bg-blue-600 rounded-xl">
            <Eye className="h-10 w-10 text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-gray-900">Real-Time Monitoring</h3>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl">
              Live tracking ensures every compliance metric is met instantly, minimizing risks.
            </p>
          </div>
        </div>

        {/* Feature Block 3 - Left-Aligned */}
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="w-16 h-16 flex items-center justify-center bg-blue-600 rounded-xl">
            <ShieldCheck className="h-10 w-10 text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-gray-900">Industry-Leading Security</h3>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl">
              Procezly meets the highest standards of encryption and data integrity, ensuring compliance at every level.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
