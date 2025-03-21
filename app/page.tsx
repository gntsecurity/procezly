"use client";

import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import { ClipboardCheck, FileCheck, Workflow, ShieldCheck, BarChart3, Eye } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* Background Gradient Effects */}
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
              AI-powered compliance automation with real-time monitoring, digital workflows, and enterprise-grade security—built for precision manufacturing.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="w-full flex flex-col space-y-6">
            {[
              { icon: FileCheck, label: "Digital Audit Logs" },
              { icon: Workflow, label: "Automated Workflows" },
              { icon: ShieldCheck, label: "Enterprise-Grade Security" },
              { icon: BarChart3, label: "AI-Powered Analytics" },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-center space-x-6 p-6 bg-white rounded-2xl shadow-xl">
                <Icon className="h-10 w-10 text-blue-600" />
                <p className="text-lg font-semibold text-gray-900">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Why Procezly Section */}
<section className="w-full max-w-[1400px] px-12 py-40 mx-auto space-y-16">
  <h2 className="text-6xl font-bold text-center text-gray-900">
    Why Modern Manufacturing Chooses <span className="text-blue-600">Procezly</span>
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
    {[
      {
        icon: ClipboardCheck,
        title: "Automated Scheduling",
        description: "Never miss an audit again—intelligent scheduling assigns and tracks compliance in real time.",
      },
      {
        icon: Eye,
        title: "Real-Time Monitoring",
        description: "Live tracking ensures every compliance metric is met instantly, minimizing risks.",
      },
      {
        icon: ShieldCheck,
        title: "Industry-Leading Security",
        description: "Procezly meets the highest standards of encryption and data integrity, ensuring compliance at every level.",
      },
    ].map(({ icon: Icon, title, description }, i) => (
      <div 
        key={i} 
        className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300"
      >
        <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-md">
          <Icon className="h-12 w-12 text-white" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mt-6">{title}</h3>
        <p className="text-lg text-gray-600 mt-4 text-center">{description}</p>
      </div>
    ))}
  </div>
</section>
    </div>
  );
}
