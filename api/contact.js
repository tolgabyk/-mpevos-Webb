import nodemailer from 'nodemailer'

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name = '', email = '', company = '', message = '' } = req.body || {}
  if (!String(name).trim() || !String(email).trim() || !String(message).trim()) {
    return res.status(400).json({ error: 'Ad, e-posta ve mesaj zorunludur.' })
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return res.status(503).json({ error: 'Mail is not configured' })
  }

  const port = Number(process.env.SMTP_PORT) || 587
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    tls: { rejectUnauthorized: false },
  })

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.CONTACT_EMAIL || 'info@impevos.com.tr',
    replyTo: email,
    subject: `İletişim: ${name}`,
    text: `Ad: ${name}\nE-posta: ${email}\nŞirket: ${company}\n\n${message}`,
    html: `<p><strong>Ad:</strong> ${escapeHtml(name)}</p><p><strong>E-posta:</strong> ${escapeHtml(email)}</p><p><strong>Şirket:</strong> ${escapeHtml(company)}</p><p>${escapeHtml(message).replaceAll('\n', '<br>')}</p>`,
  })

  return res.status(200).json({ success: true })
}
