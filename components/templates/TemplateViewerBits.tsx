"use client";

import { Button } from "@/components/ui";

/** Browser-native PDF export — the print stylesheet strips the app chrome. */
export function PrintButton({ label }: { label: string }) {
  return (
    <Button variant="gold" onClick={() => window.print()}>
      {label}
    </Button>
  );
}
