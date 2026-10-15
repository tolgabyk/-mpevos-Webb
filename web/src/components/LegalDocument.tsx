import type { LegalBlock } from "@/content/legal";

export function LegalDocument({ doc }: { doc: { title: string; updated: string; blocks: readonly LegalBlock[] } }) {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">{doc.updated}</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight sm:text-5xl">{doc.title}</h1>
      <div className="mt-10 space-y-8">
        {doc.blocks.map((block) => (
          <section key={block.heading}>
            <h2 className="text-xl">{block.heading}</h2>
            {block.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-sm leading-relaxed text-mist">{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
