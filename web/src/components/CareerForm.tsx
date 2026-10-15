"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import type { Dictionary } from "@/content/dictionary";
import { localePath, type Locale } from "@/lib/i18n";
import { Field } from "@/components/ContactForm";

export function CareerForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (String(data.get("website") || "").trim()) return;
    if (!data.get("consent")) {
      setStatus("error");
      setError(dict.common.required);
      return;
    }
    const file = data.get("cv");
    if (!(file instanceof File) || file.size === 0) {
      setStatus("error");
      setError(dict.common.required);
      return;
    }
    setStatus("sending");
    setError("");
    data.set("locale", locale);
    try {
      const response = await fetch("/api/career", { method: "POST", body: data });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(payload?.error || "failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError(dict.career.error);
    }
  }

  if (status === "success") {
    return <p className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-relaxed" role="status">{dict.career.success}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <Field label={dict.career.name} name="name" required />
      <Field label={dict.career.university} name="university" required />
      <Field label={dict.career.department} name="department" required />
      <label className="grid gap-2 text-sm">
        <span>{dict.career.cv}</span>
        <input name="cv" type="file" required accept=".pdf,.doc,.docx,application/pdf" className="text-sm text-white/70 file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:text-ink" />
        <span className="text-xs text-white/45">{dict.career.cvHint}</span>
      </label>
      <label className="flex items-start gap-3 text-sm text-white/75">
        <input type="checkbox" name="consent" required className="mt-1" />
        <span>
          {dict.career.consent}{" "}
          <Link href={localePath(locale, "/kvkk")} className="underline underline-offset-2">{dict.common.kvkk}</Link>
        </span>
      </label>
      {status === "error" && error ? <p className="text-sm text-red-300" role="alert">{error}</p> : null}
      <button type="submit" disabled={status === "sending"} className="rounded-full bg-white px-5 py-3 text-sm font-medium text-ink disabled:opacity-60">
        {status === "sending" ? dict.career.sending : dict.career.submit}
      </button>
    </form>
  );
}
