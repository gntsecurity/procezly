"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function VerifyEmail() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkEmailVerification = async () => {
      setLoading(true);
      setError(null);

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        setError("No active session. Please log in.");
        setLoading(false);
        return;
      }

      const { data: user, error: userError } = await supabase.auth.getUser();
      
      // ✅ Ensure user and email confirmation are properly checked
      if (userError || !user?.user?.email_confirmed_at) {
        setError("Email not verified. Please check your inbox.");
        setLoading(false);
        return;
      }

      // ✅ Redirect to Organization Setup if email is verified
      router.push("/org-setup");
    };

    checkEmailVerification();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-black px-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-center">Verifying Email...</h2>
        <p className="text-gray-600 text-center mt-2">
          Checking your email verification status.
        </p>

        {error && (
          <p className="text-red-600 text-sm text-center mt-4">{error}</p>
        )}

        {loading && <p className="text-center mt-4">⏳ Please wait...</p>}
      </div>
    </div>
  );
}
