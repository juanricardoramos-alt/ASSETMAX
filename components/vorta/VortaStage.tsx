"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { VortaSayDetail, VortaPointDetail } from "@/lib/vorta-events";
import {
  VortaMascot,
  type VortaMood,
  type VortaPointDir,
} from "@/components/vorta/VortaMascot";
import { VortaChatPanel } from "@/components/vorta/VortaChatPanel";
import { IconClose } from "@/components/icons";
import { cn } from "@/lib/utils";

// VORTA's stage: the persistent floating layer that lets the mascot live
// across navigations, be dragged, speak contextual bubbles, react to
// platform events and run guided tours — while staying institutional:
// short, restrained motion, transforms/opacity only, zero libraries.

const SEEN_KEY = "vmx-vorta-seen";
const HIDDEN_KEY = "vmx-vorta-hidden";
const PRESENTATION_KEY = "vmx-vorta-presentation";
const MIN_KEY = "vmx-vorta-min";
const POS_KEY = "vmx-vorta-pos";
const ctxSeenKey = (k: string) => `vmx-vorta-ctx-${k}`;

const SIZE = 56;
const MARGIN = 16;

type Pos = { x: number; y: number };
type Bubble =
  | { kind: "ctx" | "say" | "alert"; text: string }
  | {
      kind: "tour";
      title: string;
      text: string;
      index: number;
      total: number;
    };

function clampPos(p: Pos): Pos {
  const maxX = window.innerWidth - SIZE - MARGIN;
  const maxY = window.innerHeight - SIZE - MARGIN;
  return {
    x: Math.min(Math.max(p.x, MARGIN), Math.max(maxX, MARGIN)),
    y: Math.min(Math.max(p.y, MARGIN), Math.max(maxY, MARGIN)),
  };
}

function defaultPos(): Pos {
  return {
    x: window.innerWidth - SIZE - MARGIN,
    y: window.innerHeight - SIZE - MARGIN,
  };
}

/** Route → context key for bubbles and tours. */
function contextOf(pathname: string): string | null {
  const rest = pathname.replace(/^\/(en|es)/, "").replace(/^\/+/, "");
  if (rest.startsWith("vorta-studio")) return null;
  if (rest === "") return "home";
  if (rest.startsWith("dashboard/dataroom")) return "dataroom";
  if (rest.startsWith("dashboard")) return "dashboard";
  const head = rest.split("/")[0];
  if (
    ["projects", "needs", "tenders", "companies", "suppliers", "matching", "services"].includes(
      head
    )
  ) {
    return head;
  }
  return null;
}

export function VortaStage({
  dict,
  lang,
  aiEnabled,
}: {
  dict: Dictionary;
  lang: Locale;
  aiEnabled: boolean;
}) {
  const v = dict.vorta;
  const pathname = usePathname() ?? "/";
  const { data: session } = useSession();
  const role = session?.user?.role as string | undefined;

  const [mounted, setMounted] = useState(false);
  const [disabled, setDisabled] = useState<null | "hidden" | "presentation">(null);
  const [minimized, setMinimized] = useState(false);
  const [seen, setSeen] = useState(true);
  const [pos, setPos] = useState<Pos | null>(null);
  const [traveling, setTraveling] = useState(false);
  const [mood, setMood] = useState<VortaMood>("idle");
  const [pointDir, setPointDir] = useState<VortaPointDir>("left");
  const [bubble, setBubble] = useState<Bubble | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [dragging, setDragging] = useState(false);

  const restPos = useRef<Pos | null>(null);
  const reduced = useRef(false);
  const moodTimer = useRef<ReturnType<typeof setTimeout>>();
  const bubbleTimer = useRef<ReturnType<typeof setTimeout>>();
  const ctxTimer = useRef<ReturnType<typeof setTimeout>>();
  const travelTimer = useRef<ReturnType<typeof setTimeout>>();
  const tourRef = useRef<{ ctx: string; index: number } | null>(null);
  const ringEl = useRef<Element | null>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
  } | null>(null);

  const ctx = contextOf(pathname);
  const tour = ctx ? (v.tours as Record<string, { title: string; stops: { key: string; title: string; text: string }[] } | undefined>)[ctx] : undefined;

  /* ------------------------------------------------------------ lifecycle */

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setSeen(!!localStorage.getItem(SEEN_KEY));
    setMinimized(!!sessionStorage.getItem(MIN_KEY));

    // ?vorta=on|off — quick re-enable / presentation kill-switch via URL.
    const q = new URLSearchParams(window.location.search).get("vorta");
    if (q === "on") {
      localStorage.removeItem(HIDDEN_KEY);
      localStorage.removeItem(PRESENTATION_KEY);
    } else if (q === "off") {
      localStorage.setItem(PRESENTATION_KEY, "1");
    }
    setDisabled(
      localStorage.getItem(PRESENTATION_KEY)
        ? "presentation"
        : localStorage.getItem(HIDDEN_KEY)
          ? "hidden"
          : null
    );

    try {
      const stored = sessionStorage.getItem(POS_KEY);
      const p = stored ? clampPos(JSON.parse(stored) as Pos) : defaultPos();
      restPos.current = p;
      setPos(p);
    } catch {
      restPos.current = defaultPos();
      setPos(restPos.current);
    }
    setMounted(true);

    const onResize = () => {
      if (restPos.current) {
        restPos.current = clampPos(restPos.current);
        setPos((prev) => (prev ? clampPos(prev) : prev));
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const setTransientMood = useCallback((m: VortaMood, ms: number) => {
    setMood(m);
    clearTimeout(moodTimer.current);
    moodTimer.current = setTimeout(() => setMood("idle"), ms);
  }, []);

  const clearRing = () => {
    ringEl.current?.classList.remove("vorta-target-ring");
    ringEl.current = null;
  };

  const showBubble = useCallback((b: Bubble, ms?: number) => {
    setBubble(b);
    clearTimeout(bubbleTimer.current);
    if (b.kind !== "tour") {
      bubbleTimer.current = setTimeout(() => setBubble(null), ms ?? 9000);
    }
  }, []);

  const returnHome = useCallback(() => {
    clearRing();
    setTraveling(false);
    if (restPos.current) setPos(restPos.current);
    setMood("idle");
  }, []);

  /* ------------------------------------------------- travel to an element */

  const travelTo = useCallback(
    (el: Element, after?: () => void) => {
      const run = () => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return;
        let dir: VortaPointDir = "left";
        let x = rect.right + 14;
        let y = rect.top + rect.height / 2 - SIZE / 2;
        if (x + SIZE + MARGIN > window.innerWidth) {
          x = rect.left - SIZE - 14;
          dir = "right";
        }
        if (x < MARGIN) {
          x = rect.left + rect.width / 2 - SIZE / 2;
          y = rect.bottom + 14;
          dir = "up";
        }
        const p = clampPos({ x, y });
        clearRing();
        el.classList.add("vorta-target-ring");
        ringEl.current = el;
        setPointDir(dir);
        setMood("point");
        if (!reduced.current) {
          setTraveling(true);
          setPos(p);
        }
        after?.();
      };
      el.scrollIntoView({
        behavior: reduced.current ? "auto" : "smooth",
        block: "center",
      });
      clearTimeout(travelTimer.current);
      travelTimer.current = setTimeout(run, reduced.current ? 60 : 480);
    },
    []
  );

  /* --------------------------------------------------------------- tours */

  const goToStop = useCallback(
    (index: number, direction: 1 | -1 = 1) => {
      if (!tour || !ctx) return;
      // Skip stops whose target is absent or invisible on this viewport.
      let i = index;
      while (i >= 0 && i < tour.stops.length) {
        const stop = tour.stops[i];
        const el = document.querySelector(`[data-vorta-tour="${stop.key}"]`);
        const rect = el?.getBoundingClientRect();
        if (el && rect && (rect.width > 0 || rect.height > 0)) {
          tourRef.current = { ctx, index: i };
          const total = tour.stops.length;
          travelTo(el, () =>
            setBubble({
              kind: "tour",
              title: stop.title,
              text: stop.text,
              index: i,
              total,
            })
          );
          return;
        }
        i += direction;
      }
      // Ran out of reachable stops → end.
      tourRef.current = null;
      setBubble(null);
      returnHome();
    },
    [tour, ctx, travelTo, returnHome]
  );

  const endTour = useCallback(() => {
    tourRef.current = null;
    setBubble(null);
    returnHome();
  }, [returnHome]);

  const startTour = useCallback(() => {
    if (!tour) return;
    setPanelOpen(false);
    goToStop(0, 1);
  }, [tour, goToStop]);

  /* ------------------------------------------------------- event bus */

  useEffect(() => {
    const onCelebrate = () => setTransientMood("celebrate", 3200);
    const onSay = (e: Event) => {
      const d = (e as CustomEvent<VortaSayDetail>).detail;
      if (!d?.text) return;
      if (d.mood) setTransientMood(d.mood, Math.min(d.duration ?? 4000, 6000));
      showBubble({ kind: "say", text: d.text }, d.duration);
    };
    const onAlert = (e: Event) => {
      const d = (e as CustomEvent<{ text?: string }>).detail;
      setTransientMood("alert", 8000);
      showBubble({ kind: "alert", text: d?.text || v.react.alert }, 8000);
    };
    const onPoint = (e: Event) => {
      const d = (e as CustomEvent<VortaPointDetail>).detail;
      if (!d?.selector) return;
      const el = document.querySelector(d.selector);
      if (!el) return;
      travelTo(el, () => {
        if (d.text) showBubble({ kind: "say", text: d.text }, d.duration ?? 7000);
      });
      clearTimeout(moodTimer.current);
      moodTimer.current = setTimeout(() => returnHome(), d.duration ?? 7000);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (tourRef.current || bubble)) {
        endTour();
      }
    };
    window.addEventListener("vorta:celebrate", onCelebrate);
    window.addEventListener("vorta:say", onSay);
    window.addEventListener("vorta:alert", onAlert);
    window.addEventListener("vorta:point", onPoint);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("vorta:celebrate", onCelebrate);
      window.removeEventListener("vorta:say", onSay);
      window.removeEventListener("vorta:alert", onAlert);
      window.removeEventListener("vorta:point", onPoint);
      window.removeEventListener("keydown", onKey);
    };
  }, [setTransientMood, showBubble, travelTo, returnHome, endTour, bubble, v.react.alert]);

  /* -------------------------------------- contextual bubble per route */

  useEffect(() => {
    // Navigation resets any in-flight tour/travel.
    if (tourRef.current) endTour();
    else returnHome();
    setBubble(null);

    if (!ctx || minimized || disabled) return;
    const contexts = v.context as Record<string, string | undefined>;
    let text = contexts[ctx];
    if (ctx === "dashboard" && role) {
      const byRole: Record<string, string | undefined> = {
        SELLER: contexts.dashboardSeller,
        PARTNER: contexts.dashboardSeller,
        SUPPLIER: contexts.dashboardSupplier,
        INVESTOR: contexts.dashboardInvestor,
      };
      text = byRole[role] ?? text;
    }
    if (!text || sessionStorage.getItem(ctxSeenKey(ctx))) return;

    clearTimeout(ctxTimer.current);
    const msg = text;
    ctxTimer.current = setTimeout(() => {
      sessionStorage.setItem(ctxSeenKey(ctx), "1");
      showBubble({ kind: "ctx", text: msg });
    }, 1400);
    return () => clearTimeout(ctxTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, mounted, minimized, disabled]);

  /* --------------------------------------------------------------- drag */

  const onPointerDown = (e: React.PointerEvent) => {
    if (!pos) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
      moved: false,
    };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) < 5) return;
    d.moved = true;
    setDragging(true);
    setPos(clampPos({ x: d.origX + dx, y: d.origY + dy }));
  };

  const onPointerUp = () => {
    const d = dragRef.current;
    dragRef.current = null;
    setDragging(false);
    if (d?.moved) {
      // New rest position, remembered for the session.
      setPos((p) => {
        if (p) {
          restPos.current = p;
          sessionStorage.setItem(POS_KEY, JSON.stringify(p));
        }
        return p;
      });
    } else {
      // Plain click → open the contextual help panel.
      localStorage.setItem(SEEN_KEY, "1");
      setSeen(true);
      setBubble(null);
      setPanelOpen(true);
    }
  };

  /* ------------------------------------------------------------ controls */

  const hideCompletely = () => {
    localStorage.setItem(HIDDEN_KEY, "1");
    setPanelOpen(false);
    endTour();
    setDisabled("hidden");
  };

  const presentationMode = () => {
    localStorage.setItem(PRESENTATION_KEY, "1");
    setPanelOpen(false);
    endTour();
    setDisabled("presentation");
  };

  const toggleMinimized = () => {
    setMinimized((m) => {
      const next = !m;
      if (next) {
        sessionStorage.setItem(MIN_KEY, "1");
        setBubble(null);
        endTour();
      } else {
        sessionStorage.removeItem(MIN_KEY);
      }
      return next;
    });
  };

  if (!mounted || disabled || !pos) return null;

  const inRightHalf = pos.x > window.innerWidth / 2 - SIZE;
  const inBottomHalf = pos.y > window.innerHeight / 2 - SIZE;

  const panelControls = (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-navy-100 bg-navy-50/60 px-4 py-2">
      {tour && (
        <button
          onClick={startTour}
          className="text-xs font-semibold text-navy-700 underline decoration-gold-400 transition hover:text-navy-950"
        >
          {v.stage.tourStart}
        </button>
      )}
      <button
        onClick={() => {
          setPanelOpen(false);
          toggleMinimized();
        }}
        className="text-xs font-medium text-navy-500 transition hover:text-navy-800"
      >
        {minimized ? v.stage.restore : v.stage.minimize}
      </button>
      <button
        onClick={hideCompletely}
        className="text-xs font-medium text-navy-500 transition hover:text-navy-800"
      >
        {v.stage.hide}
      </button>
      <button
        onClick={presentationMode}
        className="text-xs font-medium text-navy-500 transition hover:text-navy-800"
      >
        {v.stage.presentation}
      </button>
    </div>
  );

  return (
    <div role="complementary" aria-label={v.name} className="print:hidden">
      {/* Persistent floating layer — never blocks surrounding content */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50",
          !dragging && "vorta-stage-move",
          panelOpen && "pointer-events-none opacity-0"
        )}
        style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      >
        {/* Speech bubble */}
        {bubble && !minimized && (
          <div
            role="status"
            onClick={
              bubble.kind !== "tour"
                ? () => {
                    // Tapping the bubble engages: open the contextual help panel.
                    localStorage.setItem(SEEN_KEY, "1");
                    setSeen(true);
                    setBubble(null);
                    setPanelOpen(true);
                  }
                : undefined
            }
            className={cn(
              "vorta-bubble-in absolute w-[290px] max-w-[calc(100vw-2rem)] rounded-2xl border border-navy-100 bg-white p-4 shadow-card-hover",
              bubble.kind !== "tour" && "cursor-pointer",
              inRightHalf ? "right-0" : "left-0",
              inBottomHalf ? "bottom-[68px]" : "top-[68px]"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gold-600">
                {bubble.kind === "tour"
                  ? `${(bubble.index ?? 0) + 1} ${v.stage.stepOf} ${bubble.total} · ${bubble.title}`
                  : v.name}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  bubble.kind === "tour" ? endTour() : setBubble(null);
                }}
                aria-label={dict.common.close}
                className="-m-1 rounded p-1 text-navy-400 transition hover:bg-navy-50 hover:text-navy-800"
              >
                <IconClose className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-navy-700">
              {bubble.text}
            </p>
            {bubble.kind === "tour" && (
              <div className="mt-3 flex items-center justify-between gap-2">
                <button
                  onClick={endTour}
                  className="text-xs font-medium text-navy-400 transition hover:text-navy-700"
                >
                  {v.stage.tourSkip}
                </button>
                <div className="flex gap-2">
                  {bubble.index > 0 && (
                    <button
                      onClick={() => goToStop(bubble.index - 1, -1)}
                      className="rounded-md border border-navy-200 px-2.5 py-1.5 text-xs font-semibold text-navy-700 transition hover:bg-navy-50"
                    >
                      {v.stage.tourPrev}
                    </button>
                  )}
                  <button
                    onClick={() =>
                      bubble.index + 1 >= bubble.total
                        ? endTour()
                        : goToStop(bubble.index + 1, 1)
                    }
                    className="rounded-md bg-navy-950 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-navy-800"
                  >
                    {bubble.index + 1 >= bubble.total
                      ? v.stage.tourDone
                      : v.stage.tourNext}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mascot button — draggable, click opens the help panel */}
        <div className="group relative">
          {/* Hover controls */}
          <div
            className={cn(
              "pointer-events-none absolute -top-9 flex gap-1 rounded-full border border-navy-100 bg-white px-1.5 py-1 opacity-0 shadow-card transition-opacity duration-200 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100",
              inRightHalf ? "right-0" : "left-0"
            )}
          >
            <button
              onClick={toggleMinimized}
              title={minimized ? v.stage.restore : v.stage.minimize}
              aria-label={minimized ? v.stage.restore : v.stage.minimize}
              className="rounded-full px-1.5 text-sm font-bold leading-none text-navy-500 transition hover:text-navy-900"
            >
              {minimized ? "+" : "–"}
            </button>
            <button
              onClick={presentationMode}
              title={v.stage.presentation}
              aria-label={v.stage.presentation}
              className="rounded-full px-1.5 text-[11px] font-bold leading-none text-navy-500 transition hover:text-navy-900"
            >
              ▢
            </button>
            <button
              onClick={hideCompletely}
              title={v.stage.hide}
              aria-label={v.stage.hide}
              className="rounded-full px-1.5 text-sm font-bold leading-none text-navy-500 transition hover:text-navy-900"
            >
              ×
            </button>
          </div>

          <button
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            aria-label={v.open}
            title={v.stage.dragHint}
            className={cn(
              "relative flex h-14 w-14 touch-none items-center justify-center rounded-full bg-navy-950 shadow-card-hover ring-1 ring-navy-800 transition-transform",
              dragging ? "scale-105 cursor-grabbing" : "cursor-grab hover:scale-105",
              minimized && "opacity-80"
            )}
          >
            {!seen && (
              <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-gold-500/40" />
            )}
            <VortaMascot
              mood={minimized ? "idle" : mood}
              pointDir={pointDir}
              className="h-9 w-9"
            />
          </button>
        </div>
      </div>

      {/* Contextual help panel (the existing Copilot chat, untouched) */}
      <VortaChatPanel
        dict={dict}
        lang={lang}
        aiEnabled={aiEnabled}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        controls={panelControls}
      />
    </div>
  );
}
