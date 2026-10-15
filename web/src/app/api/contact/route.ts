import { NextResponse } from "next/server";
import { company } from "@/content/company";
import { escapeHtml, getTransport } from "@/lib/mail";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    company?: string;
    message?: string;
    consent?: boolean;
    website?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.website) return NextResponse.json({ ok: true });

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const companyName = (body.company || "").trim();
  const message = (body.message || "").trim();

  if (!name || !email || !companyName || !message || body.consent !== true) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (!emailPattern.test(email) || name.length > 120 || companyName.length > 160 || message.length > 5000) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const transport = getTransport();
  if (!transport) {
    return NextResponse.json({ error: "Mail is not configured" }, { status: 503 });
  }

  const to = process.env.CONTACT_EMAIL || company.email;
  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    replyTo: email,
    subject: `İletişim: ${name} · ${companyName}`,
    text: `Ad: ${name}\nE-posta: ${email}\nŞirket: ${companyName}\n\n${message}`,
    html: `<p><strong>Ad:</strong> ${escapeHtml(name)}</p><p><strong>E-posta:</strong> ${escapeHtml(email)}</p><p><strong>Şirket:</strong> ${escapeHtml(companyName)}</p><p>${escapeHtml(message).replaceAll("\n", "<br>")}</p>`,
  });

  return NextResponse.json({ ok: true });
}
