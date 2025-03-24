"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function OrgSetup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    orgSize: "",
    industry: "",
    complianceNeeds: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Get the current user
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setError("User authentication failed.");
      setLoading(false);
      return;
    }

    // Save org setup data (future: insert into 'organizations' table)
    const { error } = await supabase.from("organizations").insert([
      {
        user_id: user.user.id,
        org_size: formData.orgSize,
        industry: formData.industry,
        compliance_needs: formData.complianceNeeds,
      },
    ]);

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard"); // Redirect after setup
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-black px-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-center">Organization Setup</h2>
        <p className="text-gray-600 text-center mt-2">
          Tell us more about your organization to optimize your experience.
        </p>

        {error && <p className="text-red-600 text-sm text-center mt-2">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            name="orgSize"
            placeholder="Number of Employees"
            value={formData.orgSize}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="industry"
            placeholder="Industry (e.g., Manufacturing, Finance)"
            value={formData.industry}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            name="complianceNeeds"
            placeholder="What are your compliance priorities?"
            value={formData.complianceNeeds}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Saving..." : "Complete Setup"}
          </button>
        </form>
      </div>
    </div>
  );
}
