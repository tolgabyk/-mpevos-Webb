"use client";

import { useState } from "react";

export function Portrait({ src, name, initials, placeholder }: { src: string; name: string; initials: string; placeholder: string }) {
  const [missing, setMissing] = useState(false);

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-[#121826]">
      {missing ? (
        <div className="flex h-full flex-col items-center justify-center gap-3">
          <span className="font-mono text-2xl tracking-[0.2em] text-white/80">{initials}</span>
          <span className="px-4 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">{placeholder}</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full object-cover" onError={() => setMissing(true)} />
      )}
    </div>
  );
}
