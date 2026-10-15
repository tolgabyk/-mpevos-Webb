import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-page px-5 py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">404</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight">Sayfa bulunamadı</h1>
      <p className="mt-3 text-mist">Page not found.</p>
      <Link href="/" className="mt-8 inline-block rounded-full bg-white px-4 py-2 text-sm text-ink">
        IMPEVOS
      </Link>
    </div>
  );
}
