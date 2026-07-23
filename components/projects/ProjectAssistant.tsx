"use client";

import { useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { Button, Card, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { IconMessage } from "@/components/icons";

type ChatMessage = { role: "user" | "assistant"; content: string };

export function ProjectAssistant({
  projectId,
  dict,
  enabled,
}: {
  projectId: string;
  dict: Dictionary;
  enabled: boolean;
}) {
  const t = dict.ai.assistant;
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: t.intro },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question || busy) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setTimeout(() => scrollRef.current?.scrollTo({ top: 1e6, behavior: "smooth" }), 50);
    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          // Skip the canned intro message — only real conversation turns.
          messages: next.slice(1).slice(-10),
        }),
      });
      if (!res.ok) throw new Error();
      const { answer } = (await res.json()) as { answer: string };
      setMessages((m) => [...m, { role: "assistant", content: answer }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: dict.common.error }]);
    } finally {
      setBusy(false);
      setTimeout(() => scrollRef.current?.scrollTo({ top: 1e6, behavior: "smooth" }), 50);
    }
  }

  return (
    <Card className="p-7">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
            <IconMessage className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy-950">{t.title}</h2>
            <p className="text-xs text-navy-500">{t.subtitle}</p>
          </div>
        </div>
        <span className="hidden rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-bold text-gold-800 ring-1 ring-gold-300 sm:inline">
          {dict.ai.poweredBy}
        </span>
      </div>

      {!enabled ? (
        <p className="mt-5 rounded-lg bg-navy-50 px-4 py-3 text-sm text-navy-500">
          {t.disabled}
        </p>
      ) : (
        <>
          <div
            ref={scrollRef}
            className="mt-5 max-h-80 space-y-3 overflow-y-auto rounded-lg bg-navy-50/60 p-4"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    m.role === "user"
                      ? "rounded-br-sm bg-navy-900 text-white"
                      : "rounded-bl-sm bg-white text-navy-800 shadow-card"
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-2.5 text-sm text-navy-400 shadow-card">
                  {t.thinking}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={send} className="mt-3 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1"
            />
            <Button type="submit" variant="gold" disabled={busy || !input.trim()}>
              {t.send}
            </Button>
          </form>
          <p className="mt-2 text-[11px] leading-relaxed text-navy-400">{t.disclaimer}</p>
        </>
      )}
    </Card>
  );
}
