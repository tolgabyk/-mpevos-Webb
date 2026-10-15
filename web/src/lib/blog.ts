import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Locale } from "@/lib/i18n";

const blogDir = path.join(process.cwd(), "content/blog");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
};

function filePath(slug: string, locale: Locale) {
  return path.join(blogDir, `${slug}.${locale}.mdx`);
}

export function listPosts(locale: Locale): PostMeta[] {
  if (!fs.existsSync(blogDir)) return [];
  const slugs = new Set<string>();
  for (const file of fs.readdirSync(blogDir)) {
    if (file.endsWith(`.${locale}.mdx`)) slugs.add(file.replace(`.${locale}.mdx`, ""));
  }
  return [...slugs]
    .map((slug) => {
      const { data } = matter(fs.readFileSync(filePath(slug, locale), "utf8"));
      return {
        slug,
        title: String(data.title ?? slug),
        description: String(data.description ?? ""),
        date: String(data.date ?? ""),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function readPostSource(slug: string, locale: Locale) {
  const full = filePath(slug, locale);
  if (!fs.existsSync(full)) return null;
  return fs.readFileSync(full, "utf8");
}

export function listSlugs() {
  if (!fs.existsSync(blogDir)) return [];
  const slugs = new Set<string>();
  for (const file of fs.readdirSync(blogDir)) {
    const match = file.match(/^(.+)\.(tr|en)\.mdx$/);
    if (match) slugs.add(match[1]);
  }
  return [...slugs];
}
