"use client";

import { useState } from "react";
import { SmartImage } from "@/components/SmartImage";
import { cn } from "@/lib/utils";

export function Gallery({
  images,
  title,
}: {
  images: { url: string; alt: string }[];
  title: string;
}) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 text-4xl font-bold text-white/20">
        AMX
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-80 overflow-hidden rounded-2xl bg-navy-100 sm:h-[440px]">
        <SmartImage
          src={images[index].url}
          alt={images[index].alt || title}
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              onClick={() => setIndex(i)}
              className={cn(
                "relative h-20 w-28 overflow-hidden rounded-lg border-2 transition",
                i === index
                  ? "border-gold-500"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
              aria-label={`Image ${i + 1}`}
            >
              <SmartImage src={img.url} alt="" sizes="112px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
