"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Use idle time for localStorage check
    const checkConsent = () => {
      const consent = localStorage.getItem("cookie-consent");
      if (!consent) setVisible(true);
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(checkConsent);
    } else {
      setTimeout(checkConsent, 200); // Fallback
    }
  }, []);

  const handleConsent = (value: "accepted" | "declined") => {
    localStorage.setItem("cookie-consent", value);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-5xl mx-auto bg-white border border-gray-200 shadow-xl rounded-2xl p-5 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4"
          role="region"
          aria-label="Cookie consent banner"
        >
          <p className="text-sm text-gray-800 md:text-base">
            We use cookies to enhance your experience. You can accept or decline them.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleConsent("declined")}
              className="px-4 py-2 text-sm rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
            >
              Decline
            </button>
            <button
              onClick={() => handleConsent("accepted")}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
