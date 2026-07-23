"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { Button, Input, Label, Textarea } from "@/components/ui";

export function ContactForm({ dict }: { dict: Dictionary }) {
  const [sent, setSent] = useState(false);
  const t = dict.pages.contact;

  if (sent) {
    return (
      <div className="rounded-xl bg-emerald-50 p-8 text-center ring-1 ring-emerald-200">
        <p className="text-3xl">✓</p>
        <p className="mt-3 text-sm font-medium text-emerald-800">{t.success}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="c-name">{t.name}</Label>
          <Input id="c-name" name="name" required />
        </div>
        <div>
          <Label htmlFor="c-email">{t.email}</Label>
          <Input id="c-email" name="email" type="email" required />
        </div>
      </div>
      <div>
        <Label htmlFor="c-subject">{t.subject}</Label>
        <Input id="c-subject" name="subject" required />
      </div>
      <div>
        <Label htmlFor="c-message">{t.message}</Label>
        <Textarea id="c-message" name="message" rows={6} required />
      </div>
      <Button type="submit" variant="gold" size="lg">
        {t.send}
      </Button>
    </form>
  );
}
