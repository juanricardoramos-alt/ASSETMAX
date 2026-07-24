"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { VORTA_FAQ, VORTA_FALLBACK } from "@/lib/vorta-faq";
import { VortaMascot, type VortaMood } from "@/components/vorta/VortaMascot";
import { IconClose, IconArrowRight } from "@/components/icons";
import { cn } from "@/lib/utils";

type ChatLink = { label: string; href: string };
type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  links?: ChatLink[];
};

const SEEN_KEY = "vmx-vorta-seen";
const DAILY_LIMIT = 20;

const countKey = () => `vmx-vorta-msgs-${new Date().toISOString().slice(0, 10)}`;

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Pick the best FAQ entry by keyword hits; detect reply language from the text. */
function faqAnswer(text: string, uiLang: Locale): ChatMessage {
  const q = normalize(text);
  const lang: Locale = /(que|como|cómo|quiero|hola|proyecto|invertir|contrato|vender|comprar|publicar|cuanto|donde|fundador)/.test(
    q
  )
    ? "es"
    : /(what|how|want|hello|invest|sell|buy|list|contract|founder|price)/.test(q)
      ? "en"
      : uiLang;

  let best: (typeof VORTA_FAQ)[number] | null = null;
  let bestScore = 0;
  for (const entry of VORTA_FAQ) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (q.includes(kw)) score += kw.length > 6 ? 2 : 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }
  const src = best && bestScore >= 2 ? best[lang] : VORTA_FALLBACK[lang];
  return {
    role: "assistant",
    content: src.answer,
    links: (src.links ?? []).map((l) => ({
      label: l.label,
      href: l.href.replace("/LANG/", `/${lang}/`),
    })),
  };
}

/** Extract [label](/LANG/path) links from an AI reply into buttons. */
function parseReply(raw: string, lang: Locale): ChatMessage {
  const links: ChatLink[] = [];
  const content = raw
    .replace(/\[([^\]]+)\]\((\/[^)\s]*)\)/g, (_m, label: string, href: string) => {
      if (href.startsWith("/")) {
        links.push({ label, href: href.replace("/LANG/", `/${lang}/`) });
      }
      return "";
    })
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { role: "assistant", content, links: links.slice(0, 3) };
}

export function VortaWidget({
  dict,
  lang,
  aiEnabled,
}: {
  dict: Dictionary;
  lang: Locale;
  aiEnabled: boolean;
}) {
  const v = dict.vorta;
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(true);
  const [mood, setMood] = useState<VortaMood>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [limited, setLimited] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const moodTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setSeen(!!localStorage.getItem(SEEN_KEY));
    const onCelebrate = () => {
      setMood("celebrate");
      clearTimeout(moodTimer.current);
      moodTimer.current = setTimeout(() => setMood("idle"), 3500);
    };
    window.addEventListener("vorta:celebrate", onCelebrate);
    return () => window.removeEventListener("vorta:celebrate", onCelebrate);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const setTransientMood = (m: VortaMood, ms: number) => {
    setMood(m);
    clearTimeout(moodTimer.current);
    moodTimer.current = setTimeout(() => setMood("idle"), ms);
  };

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      localStorage.setItem(SEEN_KEY, "1");
      setSeen(true);
      setTransientMood("greet", 2600);
      if (messages.length === 0) {
        setMessages([
          {
            role: "assistant",
            content: aiEnabled ? v.welcome : `${v.welcome}\n\n${v.faqNote}`,
          },
        ]);
      }
    }
  };

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    const used = Number(localStorage.getItem(countKey()) ?? "0");
    if (aiEnabled && used >= DAILY_LIMIT) {
      setLimited(true);
      return;
    }

    const history = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(history);
    setInput("");
    setBusy(true);
    setMood("think");

    let reply: ChatMessage;
    if (aiEnabled) {
      localStorage.setItem(countKey(), String(used + 1));
      try {
        const res = await fetch("/api/ai/guide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lang,
            messages: history.map(({ role, content }) => ({ role, content })),
          }),
        });
        if (res.status === 429) {
          setLimited(true);
          setBusy(false);
          setMood("idle");
          return;
        }
        if (!res.ok) throw new Error("guide failed");
        const data = (await res.json()) as { reply: string };
        reply = parseReply(data.reply, lang);
      } catch {
        reply = faqAnswer(trimmed, lang); // never an error — quiet FAQ fallback
      }
    } else {
      await new Promise((r) => setTimeout(r, 550)); // natural beat
      reply = faqAnswer(trimmed, lang);
    }

    setMessages((m) => [...m, reply]);
    setBusy(false);
    setTransientMood("greet", 1600);
  }

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={toggle}
        aria-label={v.open}
        className={cn(
          "fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-navy-950 shadow-card-hover ring-1 ring-navy-800 transition hover:scale-105 print:hidden",
          open && "scale-0 opacity-0"
        )}
      >
        {!seen && (
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-gold-500/40" />
        )}
        <VortaMascot mood="idle" className="h-9 w-9" />
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed inset-x-2 bottom-2 top-[4.25rem] z-50 flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card-hover animate-fade-up sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[600px] sm:max-h-[calc(100dvh-6rem)] sm:w-[392px] print:hidden">
          {/* Header */}
          <div className="flex items-center gap-3 bg-navy-950 px-4 py-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-900 ring-1 ring-navy-700">
              <VortaMascot mood={mood} className="h-8 w-8" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">{v.title}</p>
              <p className="text-[11px] text-navy-300">
                {busy ? v.thinking : "VORTAMAX Global"}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label={dict.common.close}
              className="rounded-md p-1.5 text-navy-300 transition hover:bg-navy-800 hover:text-white"
            >
              <IconClose className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-navy-50/50 p-4">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    m.role === "user"
                      ? "rounded-br-md bg-navy-900 text-white"
                      : "rounded-bl-md border border-navy-100 bg-white text-navy-800 shadow-sm"
                  )}
                >
                  {m.content.split("\n\n").map((p, j) => (
                    <p key={j} className={j > 0 ? "mt-2" : undefined}>
                      {p}
                    </p>
                  ))}
                  {m.links && m.links.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {m.links.map((l) => (
                        <Link
                          key={l.href + l.label}
                          href={l.href}
                          onClick={() => setOpen(false)}
                          className="inline-flex items-center gap-1 rounded-full bg-navy-950 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-navy-800"
                        >
                          {l.label}
                          <IconArrowRight className="h-3 w-3 text-gold-400" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {busy && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-navy-100 bg-white px-4 py-3 shadow-sm">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="vorta-dot h-1.5 w-1.5 rounded-full bg-gold-500"
                      style={{ animationDelay: `${i * 0.18}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Suggestion chips */}
            {messages.length <= 1 && !busy && (
              <div className="flex flex-wrap gap-2 pt-1">
                {v.chips.map((c) => (
                  <button
                    key={c}
                    onClick={() => send(c)}
                    className="rounded-full border border-navy-200 bg-white px-3 py-1.5 text-xs font-medium text-navy-700 transition hover:border-gold-400 hover:bg-gold-50"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            {limited && (
              <div className="rounded-xl border border-gold-200 bg-gold-50 px-4 py-3 text-xs leading-relaxed text-navy-700">
                {v.limitReached}{" "}
                <Link
                  href={`/${lang}/contact`}
                  onClick={() => setOpen(false)}
                  className="font-bold text-navy-950 underline decoration-gold-500"
                >
                  {v.contactTeam}
                </Link>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-navy-100 bg-white p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={v.inputPlaceholder}
              className="min-w-0 flex-1 rounded-full border border-navy-200 px-4 py-2.5 text-sm text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/15"
            />
            <button
              type="submit"
              disabled={!input.trim() || busy}
              aria-label={v.send}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500 text-navy-950 transition hover:bg-gold-400 disabled:opacity-40"
            >
              <IconArrowRight className="h-[18px] w-[18px]" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
