import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { team } from "@/content/company";
import { getDictionary } from "@/content/dictionary";
import { CopyHex } from "@/components/CopyHex";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

const colors = [
  { name: "Ink", hex: "#070B14" },
  { name: "Text", hex: "#F4F6FB" },
  { name: "Mist", hex: "#A8B0C2" },
  { name: "Violet", hex: "#7C6CFF" },
  { name: "Blue", hex: "#4C8DFF" },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const dict = getDictionary(raw);
  return pageMetadata({
    locale: raw,
    path: "/basin-kiti",
    title: dict.meta.pressTitle,
    description: dict.meta.pressDescription,
  });
}

export default async function PressPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const dict = getDictionary(raw);

  return (
    <div className="mx-auto max-w-page px-5 py-16 sm:px-8">
      <h1 className="text-5xl font-medium tracking-tight">{dict.press.title}</h1>
      <p className="mt-4 max-w-2xl text-mist">{dict.press.text}</p>

      <section className="mt-14" aria-labelledby="logo-title">
        <h2 id="logo-title" className="text-2xl">{dict.press.logo}</h2>
        <div className="mt-4 flex items-center justify-between rounded-3xl border border-white/10 bg-[#101624] p-8">
          <img src="/brand/impevos-logo.svg" alt="IMPEVOS" className="h-12" />
          <a href="/brand/impevos-logo.svg" download className="rounded-full bg-white px-4 py-2 text-sm text-ink">{dict.common.download}</a>
        </div>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">{dict.press.logoNote}</p>
      </section>

      <section className="mt-14" aria-labelledby="color-title">
        <h2 id="color-title" className="text-2xl">{dict.press.colors}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {colors.map((color) => (
            <li key={color.hex} className="flex items-center justify-between rounded-2xl border border-white/10 p-3">
              <span className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-xl border border-white/10" style={{ background: color.hex }} />
                <span>
                  <span className="block text-sm">{color.name}</span>
                  <span className="font-mono text-xs text-white/50">{color.hex}</span>
                </span>
              </span>
              <CopyHex value={color.hex} label={dict.press.copy} copied={dict.press.copied} />
            </li>
          ))}
        </ul>
        <a href="/brand/colors.json" download className="mt-4 inline-block text-sm underline underline-offset-4">{dict.common.download} colors.json</a>
      </section>

      <section className="mt-14" aria-labelledby="founders-title">
        <h2 id="founders-title" className="text-2xl">{dict.press.founders}</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {team.map((person) => (
            <li key={person.id} className="rounded-2xl border border-white/10 p-4">
              <img src={`/brand/founders/${person.id}.svg`} alt={`${dict.team.photo}: ${person.name}`} className="aspect-[4/5] w-full rounded-xl bg-[#121826] object-cover" />
              <p className="mt-3">{person.name}</p>
              <p className="text-sm text-mist">{dict.team.roles[person.id]}</p>
              <a href={`/brand/founders/${person.id}.svg`} download className="mt-2 inline-block text-sm underline underline-offset-4">{dict.common.download}</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
