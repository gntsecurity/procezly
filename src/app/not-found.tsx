"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-white px-6 py-20">
      <h1 className="text-6xl font-bold text-blue-600 mb-6">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        The page you&#39;re looking for doesn&#39;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
