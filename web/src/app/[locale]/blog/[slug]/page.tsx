import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getDictionary } from "@/content/dictionary";
import { listSlugs, readPostSource } from "@/lib/blog";
import { isLocale, localePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return listSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const source = readPostSource(slug, raw);
  if (!source) return {};
  const { frontmatter } = await compileMDX<{ title: string; description: string }>({
    source,
    options: { parseFrontmatter: true },
  });
  return pageMetadata({
    locale: raw,
    path: `/blog/${slug}`,
    title: frontmatter.title,
    description: frontmatter.description,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const source = readPostSource(slug, raw);
  if (!source) notFound();
  const dict = getDictionary(raw);
  const { content, frontmatter } = await compileMDX<{ title: string; description: string; date: string }>({
    source,
    options: { parseFrontmatter: true },
  });

  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">{frontmatter.date}</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight sm:text-5xl">{frontmatter.title}</h1>
      <p className="mt-4 text-lg text-mist">{frontmatter.description}</p>
      <div className="article mt-8 border-t border-white/10 pt-2">{content}</div>
      <Link href={localePath(raw, "/blog")} className="mt-12 inline-block text-sm underline underline-offset-4">
        {dict.common.back}
      </Link>
    </article>
  );
}
