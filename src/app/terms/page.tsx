"use client";

import Navbar from "../../components/Navbar";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-20 text-gray-900">
        <h1 className="text-4xl font-extrabold mb-8">Terms of Service</h1>

        <section className="space-y-4">
          <p>
            Welcome to Procezly. By using our platform, you agree to the following terms and conditions.
          </p>

          <h2 className="text-2xl font-semibold mt-10">Usage Rules</h2>
          <p>
            Do not misuse the platform. You agree not to attempt unauthorized access, disrupt services,
            or engage in fraudulent behavior.
          </p>

          <h2 className="text-2xl font-semibold mt-10">Account Responsibility</h2>
          <p>
            You&apos;re responsible for maintaining the confidentiality of your login credentials and
            all activity under your account.
          </p>

          <p className="text-sm text-gray-600 pt-10">
            These terms may change periodically. Continued use of Procezly indicates agreement with the
            latest version.
          </p>
        </section>
      </main>
    </>
  );
}
