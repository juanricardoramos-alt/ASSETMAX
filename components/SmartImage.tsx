"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

function seedFrom(src: string): string {
  let hash = 0;
  for (let i = 0; i < src.length; i++) {
    hash = (hash * 31 + src.charCodeAt(i)) >>> 0;
  }
  return `vmx-${hash.toString(36)}`;
}

/**
 * next/image wrapper with a two-stage fallback so listing imagery never
 * renders broken: primary URL → seeded picsum.photos placeholder → branded
 * gradient. Keeps the "world-class first impression" even if a remote
 * placeholder disappears.
 */
export function SmartImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [stage, setStage] = useState<0 | 1 | 2>(0);

  if (stage === 2) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-800 via-navy-700 to-navy-900",
          className
        )}
        aria-label={alt}
      >
        <span className="select-none text-4xl font-bold tracking-widest text-white/20">
          VMX
        </span>
      </div>
    );
  }

  if (stage === 1) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://picsum.photos/seed/${seedFrom(src)}/1600/900`}
        alt={alt}
        className={cn("absolute inset-0 h-full w-full object-cover", className)}
        onError={() => setStage(2)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
      onError={() => setStage(1)}
    />
  );
}
