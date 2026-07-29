// VORTA event bus — the Copilot-ready interface between the platform and the
// animated mascot (components/vorta/VortaStage.tsx). Any client code (or a
// future AI copilot) can drive VORTA by dispatching these window events; the
// helpers below are safe no-ops during SSR.

export type VortaSayDetail = {
  text: string;
  mood?: "idle" | "greet" | "think" | "celebrate" | "point" | "alert";
  /** ms the bubble stays visible (default 9000) */
  duration?: number;
};

export type VortaPointDetail = {
  /** CSS selector of the element to walk to and explain */
  selector: string;
  text?: string;
  duration?: number;
};

export function vortaCelebrate(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("vorta:celebrate"));
}

export function vortaSay(detail: VortaSayDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<VortaSayDetail>("vorta:say", { detail }));
}

export function vortaAlert(text?: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<{ text?: string }>("vorta:alert", { detail: { text } })
  );
}

export function vortaPoint(detail: VortaPointDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<VortaPointDetail>("vorta:point", { detail })
  );
}
