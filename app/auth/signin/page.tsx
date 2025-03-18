"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "/lib/supabase";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      const user = data.user;
      if (user) {
        const { data: orgData } = await supabase
          .from("user_organizations")
          .select("organization_id")
          .eq("user_id", user.id)
          .single();

        if (orgData) {
          router.push("/dashboard"); // User is part of an organization
        } else {
          router.push("/auth/company-setup"); // User needs to create or join an org
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
      <div className="max-w-md w-full p-8 border rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Sign In</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSignIn} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Get Started
          </Link>
        </p>
      </div>
    </div>
  );
}
