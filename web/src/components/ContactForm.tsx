"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import type { Dictionary } from "@/content/dictionary";
import { localePath, type Locale } from "@/lib/i18n";

export function ContactForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const params = useSearchParams();
  const prefill = params.get("konu") === "awyron" ? dict.contact.preorder : "";
  const [message, setMessage] = useState(prefill);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const kvkk = useMemo(() => localePath(locale, "/kvkk"), [locale]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (String(data.get("website") || "").trim()) return;

    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const company = String(data.get("company") || "").trim();
    const body = String(data.get("message") || "").trim();
    const consent = data.get("consent") === "on";

    if (!name || !email || !company || !body || !consent) {
      setError(dict.common.required);
      setStatus("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(dict.common.invalidEmail);
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, message: body, consent, locale }),
      });
      if (!response.ok) throw new Error("failed");
      setStatus("success");
      form.reset();
      setMessage("");
    } catch {
      setStatus("error");
      setError(dict.contact.error);
    }
  }

  if (status === "success") {
    return <p className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-relaxed" role="status">{dict.contact.success}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <Field label={dict.contact.name} name="name" required />
      <Field label={dict.contact.email} name="email" type="email" required />
      <Field label={dict.contact.company} name="company" required />
      <label className="grid gap-2 text-sm">
        <span>{dict.contact.message}</span>
        <textarea
          name="message"
          required
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 outline-none"
        />
      </label>
      <label className="flex items-start gap-3 text-sm text-white/75">
        <input type="checkbox" name="consent" required className="mt-1" />
        <span>
          {dict.contact.consent}{" "}
          <Link href={kvkk} className="underline underline-offset-2">{dict.common.kvkk}</Link>
        </span>
      </label>
      {status === "error" && error ? <p className="text-sm text-red-300" role="alert">{error}</p> : null}
      <button type="submit" disabled={status === "sending"} className="rounded-full bg-white px-5 py-3 text-sm font-medium text-ink disabled:opacity-60">
        {status === "sending" ? dict.contact.sending : dict.contact.submit}
      </button>
    </form>
  );
}

export function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label className="grid gap-2 text-sm">
      <span>{label}</span>
      <input name={name} type={type} required={required} className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 outline-none" />
    </label>
  );
}
