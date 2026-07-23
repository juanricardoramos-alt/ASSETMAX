"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Textarea } from "@/components/ui";

export function MessageComposer({
  threadId,
  placeholder,
  sendLabel,
}: {
  threadId: string;
  placeholder: string;
  sendLabel: string;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setBusy(true);
    const res = await fetch(`/api/threads/${threadId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: body.trim() }),
    });
    setBusy(false);
    if (res.ok) {
      setBody("");
      router.refresh();
    }
  }

  return (
    <form onSubmit={send} className="flex gap-3">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="flex-1"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(e);
        }}
      />
      <Button type="submit" variant="gold" disabled={busy || !body.trim()}>
        {sendLabel}
      </Button>
    </form>
  );
}
