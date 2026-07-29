"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { IconClose } from "@/components/icons";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const VISITS_KEY = "vmx-visits";
const SESSION_KEY = "vmx-visit-counted";
const DISMISSED_KEY = "vmx-a2hs-dismissed";

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

/**
 * Registers the service worker and, from the second visit on, shows a
 * discreet "Add to Home Screen" suggestion (native prompt on Android/desktop,
 * a short instruction on iOS). Dismissing it is remembered.
 */
export function PwaSetup({ dict }: { dict: Dictionary }) {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    if (isStandalone() || localStorage.getItem(DISMISSED_KEY)) return;

    // Count one visit per browser session.
    let visits = Number(localStorage.getItem(VISITS_KEY) ?? "0");
    if (!sessionStorage.getItem(SESSION_KEY)) {
      visits += 1;
      localStorage.setItem(VISITS_KEY, String(visits));
      sessionStorage.setItem(SESSION_KEY, "1");
    }
    if (visits < 2) return;

    if (isIos()) {
      setIos(true);
      const t = setTimeout(() => setVisible(true), 2500);
      return () => clearTimeout(t);
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
      setTimeout(() => setVisible(true), 2500);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, "1");
  };

  const install = async () => {
    if (!installEvent) return;
    setVisible(false);
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "dismissed") localStorage.setItem(DISMISSED_KEY, "1");
    setInstallEvent(null);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-20 z-50 mx-auto max-w-md animate-fade-up sm:inset-x-auto sm:right-6 print:hidden">
      <div className="flex items-start gap-3.5 rounded-xl border border-navy-100 bg-white p-4 shadow-card-hover">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-950 text-lg font-extrabold text-gold-400">
          V
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-navy-950">{dict.pwa.installTitle}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-navy-500">
            {ios ? dict.pwa.iosHint : dict.pwa.installText}
          </p>
          <div className="mt-2.5 flex items-center gap-3">
            {!ios && (
              <button
                onClick={install}
                className="rounded-md bg-gold-500 px-3 py-1.5 text-xs font-semibold text-navy-950 transition hover:bg-gold-400"
              >
                {dict.pwa.installCta}
              </button>
            )}
            <button
              onClick={dismiss}
              className="text-xs font-semibold text-navy-500 transition hover:text-navy-800"
            >
              {dict.pwa.later}
            </button>
          </div>
        </div>
        <button
          onClick={dismiss}
          aria-label={dict.common.close}
          className="rounded-md p-1 text-navy-400 transition hover:bg-navy-50 hover:text-navy-800"
        >
          <IconClose className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
