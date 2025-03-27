"use client";

import Navbar from "../../components/Navbar";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-16 text-gray-800">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4">
          At Procezly, your privacy is our priority. This policy outlines the types of data we collect, how we use it, and the measures we take to protect it.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-2">What We Collect</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Email and contact details</li>
            <li>Usage activity and feature interactions</li>
            <li>User preferences and saved settings</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-2">How We Use It</h2>
          <p className="text-gray-700">
            The data we collect is used to provide, improve, and personalize our services. This includes optimizing performance, enhancing security, and communicating updates relevant to your use of Procezly.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-2">Your Rights</h2>
          <p className="text-gray-700">
            You have the right to access, update, or delete your information at any time. We never sell your data or share it without explicit consent.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-8">
          This policy may be updated periodically. Continued use of Procezly signifies your agreement to the most recent version.
        </p>
      </main>
    </>
  );
}
