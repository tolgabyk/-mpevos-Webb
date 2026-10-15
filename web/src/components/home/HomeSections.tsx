import Link from "next/link";
import { Suspense } from "react";
import { company, products, stats, team } from "@/content/company";
import type { Dictionary } from "@/content/dictionary";
import { localePath, type Locale } from "@/lib/i18n";
import { CareerForm } from "@/components/CareerForm";
import { ContactForm } from "@/components/ContactForm";
import { Phone, ScreenCard } from "@/components/Phone";
import { Portrait } from "@/components/Portrait";
import { Reveal } from "@/components/Reveal";
import { StatsRow } from "@/components/home/StatsRow";

const serviceIcons = ["mobile", "ai", "flow", "code"] as const;

export function HomeSections({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <>
      <section id="urunler" className="scroll-mt-20 border-t border-white/10 py-24" aria-labelledby="products-title">
        <div className="mx-auto max-w-page px-5 sm:px-8">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">{dict.products.kicker}</p>
            <h2 id="products-title" className="mt-3 text-4xl font-medium tracking-tight sm:text-5xl">{dict.products.title}</h2>
            <p className="mt-4 max-w-2xl text-mist">{dict.products.text}</p>
          </Reveal>
          <div className="mt-14 grid gap-16 lg:grid-cols-3">
            {products.map((product) => {
              const copy = dict.products.items[product.slug];
              return (
                <Reveal key={product.slug}>
                  <article className="flex h-full flex-col">
                    <Phone accent={product.accent} label={dict.products.placeholder}>
                      <ScreenCard accent={product.accent} ink={product.ink} name={copy.name} line={copy.line} />
                    </Phone>
                    <div className="mt-6">
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: product.accent }}>{copy.badge}</p>
                      <h3 className="mt-2 text-2xl tracking-tight">{copy.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-mist">{copy.line}</p>
                      <div className="mt-4 flex flex-wrap gap-3 text-sm">
                        {product.kind === "preorder" && "demo" in copy ? (
                          <>
                            <a href={product.href} target="_blank" rel="noreferrer" className="rounded-full bg-white px-4 py-2 text-ink">
                              {copy.demo} <span className="sr-only">({dict.common.external})</span>
                            </a>
                            <Link href={`${localePath(locale, "/")}?konu=awyron#iletisim`} className="rounded-full border border-white/20 px-4 py-2">
                              {copy.preorder}
                            </Link>
                          </>
                        ) : (
                          <a href={product.href} target="_blank" rel="noreferrer" className="rounded-full bg-white px-4 py-2 text-ink">
                            {copy.cta} <span className="sr-only">({dict.common.external})</span>
                          </a>
                        )}
                        <Link href={localePath(locale, `/urunler/${product.slug}`)} className="px-1 py-2 text-white/70 underline underline-offset-4">
                          {dict.common.details}
                        </Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="rakamlar" className="border-t border-white/10 py-24" aria-labelledby="stats-title">
        <div className="mx-auto max-w-page px-5 sm:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">{dict.stats.kicker}</p>
          <h2 id="stats-title" className="mt-3 text-4xl font-medium tracking-tight">{dict.stats.title}</h2>
          <StatsRow items={stats.map((item) => ({ value: item.value, label: dict.stats.items[item.id] }))} />
        </div>
      </section>

      <section id="hizmetler" className="border-t border-white/10 py-24" aria-labelledby="services-title">
        <div className="mx-auto max-w-page px-5 sm:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">{dict.services.kicker}</p>
          <h2 id="services-title" className="mt-3 max-w-xl text-4xl font-medium tracking-tight">{dict.services.title}</h2>
          <p className="mt-4 max-w-2xl text-mist">{dict.services.text}</p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {dict.services.items.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <article className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                  <ServiceIcon name={serviceIcons[index]} />
                  <h3 className="mt-5 text-xl tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{item.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="hikaye" className="border-t border-white/10 py-24" aria-labelledby="story-title">
        <div className="mx-auto grid max-w-page gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">{dict.story.kicker}</p>
            <h2 id="story-title" className="mt-3 text-4xl font-medium tracking-tight">{dict.story.title}</h2>
            <p className="mt-4 text-mist">{dict.story.text}</p>
            <ol className="mt-10 space-y-8 border-l border-white/15 pl-6">
              {dict.story.events.map((event) => (
                <li key={event.title} className="relative">
                  <span className="absolute -left-[1.7rem] top-1.5 h-2.5 w-2.5 rounded-full bg-[#8b7cff]" />
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">{event.date}</p>
                  <h3 className="mt-1 text-lg">{event.title}</h3>
                  <p className="mt-1 text-sm text-mist">{event.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex items-center">
            <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-[#101624]">
              <div className="flex aspect-video flex-col items-center justify-center gap-3 px-6 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 text-lg" aria-hidden="true">▶</span>
                <p className="text-lg">{dict.story.videoTitle}</p>
                <p className="max-w-xs font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">{dict.story.videoText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ekip" className="border-t border-white/10 py-24" aria-labelledby="team-title">
        <div className="mx-auto max-w-page px-5 sm:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">{dict.team.kicker}</p>
          <h2 id="team-title" className="mt-3 text-4xl font-medium tracking-tight">{dict.team.title}</h2>
          <p className="mt-4 max-w-2xl text-mist">{dict.team.text}</p>
          <ul className="mt-12 grid gap-6 sm:grid-cols-3">
            {team.map((person) => (
              <li key={person.id}>
                <article>
                  <Portrait src={person.photo} name={person.name} initials={person.initials} placeholder={dict.team.photo} />
                  <h3 className="mt-4 text-xl">{person.name}</h3>
                  <p className="text-sm text-mist">{dict.team.roles[person.id]}</p>
                  <a href={person.linkedin} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm underline underline-offset-4">
                    LinkedIn <span className="sr-only">{person.name}</span>
                  </a>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="kariyer" className="border-t border-white/10 py-24" aria-labelledby="career-title">
        <div className="mx-auto grid max-w-page gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">{dict.career.kicker}</p>
            <h2 id="career-title" className="mt-3 text-4xl font-medium tracking-tight">{dict.career.title}</h2>
            <p className="mt-4 text-mist">{dict.career.text}</p>
            <ul className="mt-6 space-y-2 text-sm text-white/80">
              {dict.career.points.map((point) => (
                <li key={point} className="flex gap-2"><span aria-hidden="true">—</span>{point}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-5 text-lg">{dict.career.formTitle}</h3>
            <CareerForm locale={locale} dict={dict} />
          </div>
        </div>
      </section>

      <section id="iletisim" className="border-t border-white/10 py-24" aria-labelledby="contact-title">
        <div className="mx-auto grid max-w-page gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">{dict.contact.kicker}</p>
            <h2 id="contact-title" className="mt-3 text-4xl font-medium tracking-tight">{dict.contact.title}</h2>
            <p className="mt-4 text-mist">{dict.contact.text}</p>
            <ul className="mt-8 space-y-3 text-sm">
              <li><a href={`mailto:${company.email}`}>{company.email}</a></li>
              <li><a href={company.phoneHref}>{company.phone}</a></li>
              <li><a href={company.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
              <li><a href={company.instagram} target="_blank" rel="noreferrer">Instagram · @impevos</a></li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <Suspense fallback={null}>
              <ContactForm locale={locale} dict={dict} />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}

function ServiceIcon({ name }: { name: (typeof serviceIcons)[number] }) {
  const common = "h-8 w-8 text-[#b7c0ff]";
  if (name === "mobile") {
    return (
      <svg viewBox="0 0 32 32" className={common} aria-hidden="true">
        <rect x="9" y="3" width="14" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="24" r="1" fill="currentColor" />
      </svg>
    );
  }
  if (name === "ai") {
    return (
      <svg viewBox="0 0 32 32" className={common} aria-hidden="true">
        <circle cx="16" cy="16" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 4v5M16 23v5M4 16h5M23 16h5M7 7l3.5 3.5M21.5 21.5 25 25M25 7l-3.5 3.5M10.5 21.5 7 25" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  if (name === "flow") {
    return (
      <svg viewBox="0 0 32 32" className={common} aria-hidden="true">
        <rect x="4" y="6" width="8" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <rect x="20" y="6" width="8" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <rect x="12" y="20" width="8" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 12v4h16V12M16 16v4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" className={common} aria-hidden="true">
      <path d="M10 8 5 16l5 8M22 8l5 8-5 8M18 6l-4 20" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
