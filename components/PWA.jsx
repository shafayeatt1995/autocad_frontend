"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function PWA() {
  const [platform, setPlatform] = useState("Device");
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showManualGuide, setShowManualGuide] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;

    if (/android/i.test(ua)) setPlatform("Android");
    else if (/iPad|iPhone|iPod/i.test(ua)) setPlatform("iOS");
    else if (/Mac OS X/i.test(ua)) setPlatform("MacOS");
    else if (/Windows/i.test(ua)) setPlatform("Windows");
    else if (/Linux/i.test(ua)) setPlatform("Linux");

    // Register Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("✅ Service Worker registered"))
        .catch((err) => console.error("❌ SW registration failed:", err));
    }

    // Listen for beforeinstallprompt (Chrome / Edge / Android)
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // For MacOS / Desktop browsers, show manual guide
    if (/Mac OS X|Windows|Linux/i.test(ua)) {
      setShowManualGuide(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") console.log("Installed");
        else console.log("Install dismissed");
        setDeferredPrompt(null);
      });
    } else if (showManualGuide) {
      alert(
        "To install this app on your desktop, open Chrome menu → Install [App Name] or drag the URL to your dock/desktop."
      );
    } else {
      alert("Install option not available on this device/browser.");
    }
  };

  return (
    <Button onClick={handleInstallClick} className="hidden lg:block">
      Install on {platform}
    </Button>
  );
}
