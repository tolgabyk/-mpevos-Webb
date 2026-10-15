"use client";

import { useEffect, useRef, useState } from "react";

export function StatsRow({ items }: { items: { value: number; label: string }[] }) {
  const ref = useRef<HTMLDListElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <dl ref={ref} className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="bg-ink px-6 py-8">
          <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">{item.label}</dt>
          <dd className="mt-3 text-5xl font-medium tracking-tight">
            <Count value={item.value} run={visible} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Count({ value, run }: { value: number; run: boolean }) {
  const [current, setCurrent] = useState(value);
  useEffect(() => {
    if (!run) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setCurrent(value);
      return;
    }
    const start = value > 2000 ? value - 12 : 0;
    const duration = 900;
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      setCurrent(Math.round(start + (value - start) * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, value]);
  return <span>{current}</span>;
}
