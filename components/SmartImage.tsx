"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * next/image wrapper that degrades gracefully to a branded gradient
 * if a remote placeholder image fails to load.
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
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-800 via-navy-700 to-navy-900",
          className
        )}
        aria-label={alt}
      >
        <span className="select-none text-4xl font-bold tracking-widest text-white/20">
          AMX
        </span>
      </div>
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
      onError={() => setFailed(true)}
    />
  );
}
