import { NextResponse } from "next/server";
import { company } from "@/content/company";
import { escapeHtml, getTransport } from "@/lib/mail";

export const runtime = "nodejs";

const allowed = new Set(["pdf", "doc", "docx"]);

export async function POST(request: Request) {
  const form = await request.formData();
  if (String(form.get("website") || "").trim()) return NextResponse.json({ ok: true });

  const name = String(form.get("name") || "").trim();
  const university = String(form.get("university") || "").trim();
  const department = String(form.get("department") || "").trim();
  const consent = form.get("consent");
  const file = form.get("cv");

  if (!name || !university || !department || consent !== "on") {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0 || file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Invalid CV" }, { status: 400 });
  }

  const extension = file.name.toLowerCase().split(".").pop() || "";
  if (!allowed.has(extension)) {
    return NextResponse.json({ error: "Invalid CV" }, { status: 400 });
  }

  const transport = getTransport();
  if (!transport) {
    return NextResponse.json({ error: "Mail is not configured" }, { status: 503 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const to = process.env.CAREER_EMAIL || company.careerEmail;

  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: `Staj başvurusu: ${name}`,
    text: `Ad: ${name}\nÜniversite: ${university}\nBölüm: ${department}`,
    html: `<p><strong>Ad:</strong> ${escapeHtml(name)}</p><p><strong>Üniversite:</strong> ${escapeHtml(university)}</p><p><strong>Bölüm:</strong> ${escapeHtml(department)}</p>`,
    attachments: [{ filename: file.name, content: bytes }],
  });

  return NextResponse.json({ ok: true });
}
