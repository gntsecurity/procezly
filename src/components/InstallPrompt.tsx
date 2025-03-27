"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const iOS = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
    const standalone = isStandalone();

    setIsIOS(iOS);

    if (standalone) return;

    if (iOS) {
      setShowPrompt(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 rounded-2xl border border-gray-200 bg-white shadow-xl p-4 flex items-center justify-between backdrop-blur-md animate-fade-in">
      <span className="text-sm font-medium text-gray-900">
        {isIOS
          ? 'Tap “Share” → “Add to Home Screen”'
          : 'Install Procezly to Home Screen'}
      </span>
      {!isIOS && (
        <button
          onClick={handleInstallClick}
          className="ml-4 px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Add
        </button>
      )}
    </div>
  );
}
