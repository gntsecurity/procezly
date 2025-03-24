"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleConsent = (value: "accepted" | "declined") => {
    localStorage.setItem("cookie-consent", value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-300 shadow-lg p-4 md:p-6 text-gray-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm md:text-base">
          We use cookies to enhance your experience. You can accept or decline them.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={() => handleConsent("declined")}
            className="px-4 py-2 text-sm rounded-md border border-gray-400 hover:bg-gray-100 transition"
          >
            Decline All
          </button>
          <button
            onClick={() => handleConsent("accepted")}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
