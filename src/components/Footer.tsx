"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (res.ok) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    } else {
      alert("Subscription failed. Please try again.");
    }
  };

  return (
    <footer className="bg-white pt-12 pb-6">
      <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-10">
        <div className="w-full md:w-1/3">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Procezly Logo"
              width={160}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <p className="text-gray-600 mt-2">
            Join our newsletter to stay up to date on features and releases.
          </p>
          <div className="mt-4 flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-blue-600">
              {/* Placeholder for icon */}
              <span className="text-xl">📘</span>
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600">
              {/* Placeholder for icon */}
              <span className="text-xl">🔗</span>
            </a>
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              {loading ? "Sending..." : "Subscribe"}
            </button>
          </form>

          {subscribed && (
            <p className="text-green-600 text-sm mt-2 font-medium">
              ✅ Subscribed! Check your email.
            </p>
          )}

          <p className="text-gray-500 text-sm mt-2">
            By subscribing, you agree to our{" "}
            <Link href="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>{" "}
            and consent to receive updates.
          </p>
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto mt-10 px-6 flex flex-col md:flex-row justify-between items-center border-t pt-6">
        <p className="text-gray-500 text-sm text-center md:text-left">
          &copy; 2025 Procezly. All rights reserved. A product of GNT Security.
        </p>
        <div className="flex space-x-4 text-sm mt-4 md:mt-0">
          <Link href="/privacy-policy" className="text-gray-500 hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-gray-500 hover:underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
