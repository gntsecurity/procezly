"use client";

import Navbar from "../../components/ui/Navbar";
import Footer from "../../components/ui/Footer";
import { Lightbulb, Users, ShieldCheck, Globe, TrendingUp } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 pt-28">
        <section className="text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            About <span className="text-blue-600">Procezly</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Procezly is revolutionizing Kamishibai audits with modern automation, real-time tracking, and seamless workflows.
          </p>
        </section>

        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <Lightbulb className="h-16 w-16 text-blue-600 mx-auto" />
            <h3 className="text-2xl font-semibold mt-4">Innovation</h3>
            <p className="text-gray-600">Pioneering digital solutions for compliance and efficiency.</p>
          </div>
          <div className="text-center">
            <Users className="h-16 w-16 text-blue-600 mx-auto" />
            <h3 className="text-2xl font-semibold mt-4">Collaboration</h3>
            <p className="text-gray-600">Built for manufacturers, by manufacturing experts.</p>
          </div>
          <div className="text-center">
            <ShieldCheck className="h-16 w-16 text-blue-600 mx-auto" />
            <h3 className="text-2xl font-semibold mt-4">Security</h3>
            <p className="text-gray-600">Enterprise-grade encryption and compliance assurance.</p>
          </div>
        </section>

        <section className="mt-20 text-center">
          <h2 className="text-4xl font-bold">Our Mission</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-4xl mx-auto">
            At Procezly, our goal is to empower manufacturers with smarter, faster, and more reliable compliance tracking.
            Say goodbye to inefficiencies—say hello to the future of Kamishibai audits.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
