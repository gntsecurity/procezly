import { useEffect, useState } from "react";

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const iOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const standalone = isStandalone();

    setIsIOS(iOS);

    if (standalone) return;

    if (iOS) {
      setShow(true);
    }

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferred(e);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const triggerInstall = async () => {
    if (!deferred) return;
    deferred.prompt();
    const res = await deferred.userChoice;
    if (res.outcome === "accepted") setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 rounded-2xl border border-gray-200 bg-white shadow-lg p-4 flex items-center justify-between backdrop-blur-md">
      <span className="text-sm font-medium text-gray-900">
        {isIOS ? "Tap Share → Add to Home Screen" : "Install GNT Security to Home Screen"}
      </span>
      {!isIOS && (
        <button
          onClick={triggerInstall}
          className="ml-4 px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Add
        </button>
      )}
    </div>
  );
}
