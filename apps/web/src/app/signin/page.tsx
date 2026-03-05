"use client";

export default function Page() {
  const onClick = () => {
    const api = process.env.NEXT_PUBLIC_API_ORIGIN!;
    window.location.href = api + "/auth/login";
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full border rounded-lg p-6">
        <div className="text-lg font-semibold">Sign in</div>
        <div className="mt-2 text-sm text-gray-700">
          Sign in with Azure Entra ID for your organization.
        </div>
        <button
          className="mt-6 w-full px-4 py-3 rounded-md bg-black text-white text-sm"
          onClick={onClick}
        >
          Continue with Microsoft
        </button>
      </div>
    </main>
  );
}
