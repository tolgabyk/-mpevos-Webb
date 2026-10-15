export const company = {
  brand: "IMPEVOS",
  legalName: "IMPEVOS TEKNOLOJİ A.Ş.",
  email: "info@impevos.com.tr",
  careerEmail: "kariyer@impevos.com.tr",
  phone: "0850 640 00 98",
  phoneHref: "tel:+908506400098",
  linkedin: "https://www.linkedin.com/company/112823150",
  instagram: "https://www.instagram.com/impevos",
  addressPlaceholder: {
    tr: "Adres bilgisi eklenecek — İstanbul, Türkiye",
    en: "Address to be added — Istanbul, Türkiye",
  },
  mersisPlaceholder: "MERSİS No: —",
  taxPlaceholder: {
    tr: "Vergi No: —",
    en: "Tax No: —",
  },
} as const;

export const products = [
  {
    slug: "not-ortagim",
    href: "https://apps.apple.com/tr/app/not-orta%C4%9F%C4%B1m-ai-not-asistan%C4%B1/id6758680814",
    accent: "#e7b008",
    ink: "#1a1408",
    card: "#2a2110",
    kind: "store" as const,
  },
  {
    slug: "inffy",
    href: "https://inffyai.com",
    accent: "#3ee0c5",
    ink: "#041614",
    card: "#0d2c28",
    kind: "site" as const,
  },
  {
    slug: "awyron-ai",
    href: "https://awyronai.com",
    accent: "#8b7cff",
    ink: "#100d22",
    card: "#221c40",
    kind: "preorder" as const,
  },
] as const;

export type ProductSlug = (typeof products)[number]["slug"];

export function getProduct(slug: string) {
  return products.find((item) => item.slug === slug);
}

export const team = [
  {
    id: "goktug",
    name: "Göktuğ Eryılmaz",
    initials: "GE",
    linkedin: "https://www.linkedin.com/in/göktuğ-eryılmaz-625613292/",
    photo: "/team/goktug-eryilmaz.jpeg",
  },
  {
    id: "burak",
    name: "Burak Gökçe",
    initials: "BG",
    linkedin: "https://www.linkedin.com/in/burak-gokcee/",
    photo: "/team/burak-gokce.jpeg",
  },
  {
    id: "tolga",
    name: "Tolga Bıyık",
    initials: "TB",
    linkedin: "https://www.linkedin.com/in/tolga-bıyık-468a89225/",
    photo: "/team/tolga-biyik.png",
  },
] as const;

export const stats = [
  { id: "products", value: 3 },
  { id: "interns", value: 10 },
  { id: "projects", value: 6 },
  { id: "founded", value: 2026 },
] as const;
