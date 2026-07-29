"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { vortaAlert, vortaCelebrate, vortaPoint, vortaSay } from "@/lib/vorta-events";
import { VortaMascot, type VortaMood } from "@/components/vorta/VortaMascot";
import { Button, Card } from "@/components/ui";

const MOODS: { mood: VortaMood; key: keyof Dictionary["vorta"]["studio"]["moods"] }[] = [
  { mood: "idle", key: "idle" },
  { mood: "greet", key: "greet" },
  { mood: "think", key: "think" },
  { mood: "celebrate", key: "celebrate" },
  { mood: "point", key: "point" },
  { mood: "alert", key: "alert" },
];

export function VortaStudio({ dict }: { dict: Dictionary }) {
  const t = dict.vorta.studio;
  const [hidden, setHidden] = useState(false);
  const [presentation, setPresentation] = useState(false);

  useEffect(() => {
    setHidden(!!localStorage.getItem("vmx-vorta-hidden"));
    setPresentation(!!localStorage.getItem("vmx-vorta-presentation"));
  }, []);

  const toggleHidden = () => {
    if (hidden) localStorage.removeItem("vmx-vorta-hidden");
    else localStorage.setItem("vmx-vorta-hidden", "1");
    location.reload();
  };

  const togglePresentation = () => {
    if (presentation) localStorage.removeItem("vmx-vorta-presentation");
    else localStorage.setItem("vmx-vorta-presentation", "1");
    location.reload();
  };

  const resetPos = () => {
    sessionStorage.removeItem("vmx-vorta-pos");
    location.reload();
  };

  return (
    <div className="space-y-10">
      {/* Animation states, one by one */}
      <section>
        <h2 className="mb-4 text-xl font-extrabold tracking-tight text-navy-950">
          {t.moodsTitle}
        </h2>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {MOODS.map(({ mood, key }) => (
            <Card key={mood} className="flex flex-col items-center gap-3 p-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-navy-950 ring-1 ring-navy-800">
                <VortaMascot mood={mood} className="h-16 w-16" />
              </div>
              <p className="text-sm font-semibold text-navy-800">{t.moods[key]}</p>
            </Card>
          ))}
          {/* Minimized rest state */}
          <Card className="flex flex-col items-center gap-3 p-6">
            <div className="flex h-24 w-24 items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-950 opacity-80 shadow-card-hover ring-1 ring-navy-800">
                <VortaMascot mood="idle" className="h-9 w-9" />
              </div>
            </div>
            <p className="text-sm font-semibold text-navy-800">{t.moods.minimized}</p>
          </Card>
        </div>
      </section>

      {/* Live actions — drive the real floating mascot */}
      <section>
        <h2 className="mb-1 text-xl font-extrabold tracking-tight text-navy-950">
          {t.actionsTitle}
        </h2>
        <p className="mb-4 text-sm text-navy-500">{t.pointTargetNote}</p>
        <Card data-vorta-tour="studio-target" className="p-6">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="sm" onClick={() => vortaSay({ text: t.sayDemo })}>
              {t.actionSay}
            </Button>
            <Button variant="primary" size="sm" onClick={() => vortaAlert(t.alertDemo)}>
              {t.actionAlert}
            </Button>
            <Button variant="primary" size="sm" onClick={() => vortaCelebrate()}>
              {t.actionCelebrate}
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={() =>
                vortaPoint({
                  selector: '[data-vorta-tour="studio-target"]',
                  text: t.pointTargetNote,
                })
              }
            >
              {t.actionPoint}
            </Button>
          </div>
        </Card>
      </section>

      {/* User controls */}
      <section>
        <h2 className="mb-1 text-xl font-extrabold tracking-tight text-navy-950">
          {t.controlsTitle}
        </h2>
        <p className="mb-4 text-sm text-navy-500">
          {t.controlsNote} {t.reloadNote}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant={hidden ? "gold" : "outline"} size="sm" onClick={toggleHidden}>
            {hidden ? t.controlShow : t.controlHide}
          </Button>
          <Button
            variant={presentation ? "gold" : "outline"}
            size="sm"
            onClick={togglePresentation}
          >
            {presentation ? t.controlPresentationOff : t.controlPresentationOn}
          </Button>
          <Button variant="outline" size="sm" onClick={resetPos}>
            {t.controlResetPos}
          </Button>
        </div>
      </section>
    </div>
  );
}
