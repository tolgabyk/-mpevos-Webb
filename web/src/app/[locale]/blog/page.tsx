import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content/dictionary";
import { listPosts } from "@/lib/blog";
import { isLocale, localePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const dict = getDictionary(raw);
  return pageMetadata({
    locale: raw,
    path: "/blog",
    title: dict.meta.blogTitle,
    description: dict.meta.blogDescription,
  });
}

function formatDate(date: string, locale: "tr" | "en") {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return date;
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const dict = getDictionary(raw);
  const posts = listPosts(raw);

  return (
    <div className="mx-auto max-w-page px-5 py-16 sm:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">{dict.nav.blog}</p>
      <h1 className="mt-3 text-5xl font-medium tracking-tight">{dict.blog.title}</h1>
      <p className="mt-4 max-w-2xl text-mist">{dict.blog.text}</p>
      {posts.length === 0 ? <p className="mt-10 text-mist">{dict.blog.empty}</p> : null}
      <ul className="mt-12 divide-y divide-white/10 border-y border-white/10">
        {posts.map((post) => (
          <li key={post.slug}>
            <article className="py-8">
              <time className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45" dateTime={post.date}>
                {formatDate(post.date, raw)}
              </time>
              <h2 className="mt-2 text-2xl tracking-tight">
                <Link href={localePath(raw, `/blog/${post.slug}`)}>{post.title}</Link>
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-mist">{post.description}</p>
              <Link href={localePath(raw, `/blog/${post.slug}`)} className="mt-3 inline-block text-sm underline underline-offset-4">
                {dict.common.read}
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
