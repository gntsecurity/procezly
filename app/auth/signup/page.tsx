"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "/lib/supabase";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/auth/check-email");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-100 shadow-lg rounded-xl">
        <h2 className="text-center text-2xl font-bold text-gray-900">Get Started</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg text-gray-900 focus:ring focus:ring-blue-300"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg text-gray-900 focus:ring focus:ring-blue-300"
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Get Started
          </button>
        </form>
        <p className="text-center text-gray-700 text-sm">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-blue-600 font-semibold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
