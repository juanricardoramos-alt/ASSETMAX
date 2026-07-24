"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Hero background video with strict performance discipline:
// · Nothing is rendered on the server or at hydration — the videos mount only
//   after window load + idle, so LCP and initial page weight are untouched.
// · Desktop-only: phones/tablets (<1024px) keep the static branded hero
//   (data + battery savings); prefers-reduced-motion also disables it.
// · Poster-matching styling means there is never a black hole while loading.
// · Clips rotate with a slow crossfade; a clip that fails to load is simply
//   dropped from the rotation (never an error state).
//
// Clip files live in /public/videos. Each entry lists mp4 first (real stock
// footage, when present) with a webm fallback — the browser takes the first
// source that exists and plays.

const ROTATE_MS = 9000;
const FADE_CLASS = "transition-opacity duration-[1800ms] ease-in-out";

export function HeroVideo({ clips }: { clips: { mp4: string; webm: string }[] }) {
  const [active, setActive] = useState(-1);
  const [ready, setReady] = useState(false);
  // A slot joins the rotation only after its video confirms `canplay`;
  // empty drop-in slots (404 on every source) therefore never join.
  const [playable, setPlayable] = useState<number[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    if ((navigator as { connection?: { saveData?: boolean } }).connection?.saveData) return;

    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      const idle =
        "requestIdleCallback" in window
          ? (cb: () => void) => (window as Window & { requestIdleCallback: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback(cb, { timeout: 2500 })
          : (cb: () => void) => setTimeout(cb, 1200);
      idle(() => {
        if (!cancelled) setReady(true);
      });
    };

    if (document.readyState === "complete") start();
    else {
      window.addEventListener("load", start, { once: true });
      return () => {
        cancelled = true;
        window.removeEventListener("load", start);
      };
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Slow rotation across confirmed-playable clips.
  useEffect(() => {
    if (playable.length < 2) return;
    const t = setInterval(() => {
      setActive((a) => {
        const pos = playable.indexOf(a);
        return playable[(pos + 1) % playable.length] ?? playable[0];
      });
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, [playable]);

  // Pause everything while the hero is off-screen.
  useEffect(() => {
    if (playable.length === 0) return;
    const el = videoRefs.current.find(Boolean)?.parentElement;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        for (const v of videoRefs.current) {
          if (!v) continue;
          if (entry.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [playable]);

  const markPlayable = (i: number) =>
    setPlayable((xs) => (xs.includes(i) ? xs : [...xs, i].sort((a, b) => a - b)));

  const drop = (i: number) =>
    setPlayable((xs) => {
      const next = xs.filter((x) => x !== i);
      if (!next.includes(active)) setActive(next[0] ?? -1);
      return next;
    });

  // First confirmed clip becomes the visible one.
  useEffect(() => {
    if (active === -1 && playable.length > 0) setActive(playable[0]);
  }, [playable, active]);

  if (!ready) return null;

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {clips.map((clip, i) => (
        <video
          key={clip.mp4}
          ref={(el) => {
            videoRefs.current[i] = el;
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => markPlayable(i)}
          onError={(e) => {
            // A failing <source> (e.g. an empty drop-in slot) never fires an
            // element-level error — only a true MediaError evicts a clip.
            if (e.currentTarget.error) drop(i);
          }}
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            FADE_CLASS,
            i === active ? "opacity-100" : "opacity-0"
          )}
        >
          <source src={clip.mp4} type="video/mp4" />
          <source src={clip.webm} type="video/webm" />
        </video>
      ))}
      {playable.length > 0 && (
        <>
          {/* Navy overlay — light enough to let the footage carry the hero;
              text legibility comes from the radial scrim + text shadows in
              the hero content itself. */}
          <div className="absolute inset-0 bg-navy-950/25" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/65 via-navy-950/10 to-navy-950/75" />
        </>
      )}
    </div>
  );
}
