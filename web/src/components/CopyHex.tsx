"use client";

import { useState } from "react";

export function CopyHex({ value, label, copied }: { value: string; label: string; copied: string }) {
  const [done, setDone] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      window.setTimeout(() => setDone(false), 1500);
    } catch {
      setDone(false);
    }
  }

  return (
    <button type="button" onClick={onCopy} className="rounded-full border border-white/15 px-3 py-1.5 text-xs">
      {done ? copied : label}
    </button>
  );
}
