import type { ReactNode } from "react";

export function Phone({
  accent,
  label,
  children,
}: {
  accent: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <figure className="relative mx-auto w-[220px] sm:w-[236px]">
      <div
        className="pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-50 blur-3xl"
        style={{ background: accent }}
        aria-hidden="true"
      />
      <div className="rounded-[2.15rem] border border-white/15 bg-[#090b10] p-2.5 shadow-glow">
        <div className="relative h-[452px] overflow-hidden rounded-[1.7rem] bg-[#10131c]">
          <div className="absolute left-1/2 top-2.5 z-10 h-[18px] w-[86px] -translate-x-1/2 rounded-full bg-black" />
          {children}
        </div>
      </div>
      <figcaption className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
        {label}
      </figcaption>
    </figure>
  );
}

export function ScreenCard({
  accent,
  ink,
  name,
  line,
}: {
  accent: string;
  ink: string;
  name: string;
  line: string;
}) {
  return (
    <div className="flex h-full flex-col px-4 pb-4 pt-10" style={{ background: `linear-gradient(180deg, ${ink}, #090b10 70%)` }}>
      <div className="rounded-2xl border border-white/10 p-3" style={{ background: `${accent}22` }}>
        <div className="mb-3 h-2 w-16 rounded-full" style={{ background: accent }} />
        <div className="space-y-2">
          <div className="h-8 rounded-lg bg-white/10" />
          <div className="h-8 rounded-lg bg-white/8" />
          <div className="h-16 rounded-xl" style={{ background: accent }} />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="h-20 rounded-xl bg-white/8" />
        <div className="h-20 rounded-xl border border-white/10" style={{ background: `${accent}33` }} />
      </div>
      <p className="mt-auto font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">{name}</p>
      <p className="mt-1 text-sm leading-snug text-white/80">{line}</p>
    </div>
  );
}
