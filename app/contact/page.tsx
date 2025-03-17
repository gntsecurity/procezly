"use client";

import Navbar from "../../components/ui/Navbar";
import Footer from "../../components/ui/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 pt-28">
        <section className="text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            Let's <span className="text-blue-600">Connect</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Whether you have questions, need a demo, or want to explore partnerships—we're here to help.
          </p>
        </section>

        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <Mail className="h-16 w-16 text-blue-600 mx-auto" />
            <h3 className="text-2xl font-semibold mt-4">Email Us</h3>
            <p className="text-gray-600">support@procezly.com</p>
          </div>
          <div className="text-center">
            <Phone className="h-16 w-16 text-blue-600 mx-auto" />
            <h3 className="text-2xl font-semibold mt-4">Call Us</h3>
            <p className="text-gray-600">+1 (800) 123-4567</p>
          </div>
          <div className="text-center">
            <MapPin className="h-16 w-16 text-blue-600 mx-auto" />
            <h3 className="text-2xl font-semibold mt-4">Visit Our Office</h3>
            <p className="text-gray-600">123 Manufacturing St, Detroit, MI</p>
          </div>
        </section>

        <section className="mt-20 text-center">
          <h2 className="text-4xl font-bold">Let's Talk</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-4xl mx-auto">
            Get in touch with us and discover how Procezly can transform your compliance process.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
