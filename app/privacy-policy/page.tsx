"use client";

import Navbar from "../../components/ui/Navbar";
import Footer from "../../components/ui/Footer";
import { Lock, FileText, ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 pt-28">
        <section className="text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            Privacy <span className="text-blue-600">Matters</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Your data security is our top priority. Here’s how we handle it.
          </p>
        </section>

        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <FileText className="h-16 w-16 text-blue-600 mx-auto" />
            <h3 className="text-2xl font-semibold mt-4">Data Collection</h3>
            <p className="text-gray-600">We only collect essential data for compliance tracking.</p>
          </div>
          <div className="text-center">
            <ShieldCheck className="h-16 w-16 text-blue-600 mx-auto" />
            <h3 className="text-2xl font-semibold mt-4">Data Usage</h3>
            <p className="text-gray-600">Your data powers compliance reports & workflow optimization.</p>
          </div>
          <div className="text-center">
            <Lock className="h-16 w-16 text-blue-600 mx-auto" />
            <h3 className="text-2xl font-semibold mt-4">Security</h3>
            <p className="text-gray-600">We use enterprise-grade encryption to ensure data integrity.</p>
          </div>
        </section>

        <section className="mt-20 text-center">
          <h2 className="text-4xl font-bold">We Take Security Seriously</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-4xl mx-auto">
            Procezly follows strict compliance guidelines to protect your data and maintain trust.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
