"use client";

import Navbar from "../../components/Navbar";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-16 text-gray-800">
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <p className="mb-4">
          Welcome to Procezly. By using our platform, you agree to the following terms and conditions.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-2">Usage Rules</h2>
        <p>
          Do not misuse the platform. You agree not to attempt unauthorized access, disrupt services, or engage in fraudulent behavior.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-2">Account Responsibility</h2>
        <p>
          You&apos;re responsible for maintaining the confidentiality of your login credentials and all activity under your account.
        </p>
        <p className="mt-8 text-sm text-gray-500">
          These terms may change periodically. Continued use of Procezly indicates agreement with the latest version.
        </p>
      </main>
    </>
  );
}
