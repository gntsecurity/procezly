"use client";

import { useState } from "react";

export default function RequestDemo() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Add API call or form submission logic here
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="max-w-lg w-full bg-white p-10 rounded-3xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-center text-gray-900">Book a Demo</h1>
        <p className="text-gray-600 text-center mt-3">
          Experience how Procezly can streamline your compliance process.
        </p>

        {submitted ? (
          <div className="mt-6 text-center text-green-600 text-lg">
            ✅ Thank you! We’ll reach out to schedule your demo.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black placeholder-gray-500"
                required
                placeholder="Enter your email"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Request Demo
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
