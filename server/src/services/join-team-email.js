import nodemailer from 'nodemailer'
import { getDepartmentLabel } from '../../../api/lib/join-team-departments.js'

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return null

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

function typeLabel(type) {
  return getDepartmentLabel(type) || type || '—'
}

function yesNo(val) {
  if (val === 'yes' || val === true) return 'Evet'
  if (val === 'no' || val === false) return 'Hayır'
  return val || '—'
}

function panelUrl(id) {
  const base = process.env.JOIN_TEAM_PANEL_URL || 'https://impevosekip.me/ekip-basvurulari'
  return id ? `${base}?id=${id}` : base
}

function buildCompanyHtml(app) {
  const rows = [
    ['Ad Soyad', app.fullName],
    ['Başvuru Departmanı', typeLabel(app.applicationType)],
    ['Alt Alan', app.marketingRole || app.softwareRole || '—'],
    ['E-posta', app.email],
    ['Telefon', app.phone],
    ['Şehir', app.city],
    ['Haftalık Uygunluk', app.hoursPerWeek || app.hoursPerWeekMarketing || app.weeklyHoursAP || app.hoursPerWeekOther || '—'],
    ['Claude', yesNo(app.claudeUsed)],
    ['Cursor', yesNo(app.cursorUsed)],
    ['Antigravity', yesNo(app.antigravityUsed)],
    ['GitHub / Portfolyo', app.githubPortfolio || app.portfolioLinks || '—'],
    ['Gönüllü Çalışma Onayı', app.voluntaryConsent ? 'Evet' : 'Hayır'],
    ['Başvuru Durumu', app.status || 'Yeni Başvuru'],
    ['Başvuru Kaynağı', app.source || 'Web Sitesi'],
  ]

  const tableRows = rows
    .map(([label, val]) =>
      `<tr><td style="padding:8px 12px;border:1px solid #eee;font-weight:600;white-space:nowrap;">${label}</td><td style="padding:8px 12px;border:1px solid #eee;">${String(val).replace(/\n/g, '<br/>')}</td></tr>`,
    )
    .join('')

  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:640px;">
      <h2 style="color:#000;">Yeni İmpevos Ekip Başvurusu</h2>
      <p style="color:#666;">Web sitesinden yeni bir ekip başvurusu alındı.</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px;">${tableRows}</table>
      <p style="margin-top:24px;">
        <a href="${panelUrl(app.panelId)}" style="color:#00aa00;font-weight:600;">CRM panelde başvuruyu görüntüle →</a>
      </p>
      <p style="color:#888;font-size:12px;">Başvuru ID: ${app.id}</p>
    </div>
  `
}

function buildCompanyText(app) {
  return [
    `Yeni İmpevos Ekip Başvurusu — ${app.fullName}`,
    '',
    `Ad Soyad: ${app.fullName}`,
    `Başvuru Departmanı: ${typeLabel(app.applicationType)}`,
    `Alt Alan: ${app.marketingRole || app.softwareRole || '—'}`,
    `E-posta: ${app.email}`,
    `Telefon: ${app.phone}`,
    `Şehir: ${app.city}`,
    `Haftalık Uygunluk: ${app.hoursPerWeek || app.hoursPerWeekMarketing || app.weeklyHoursAP || app.hoursPerWeekOther || '—'}`,
    `Claude: ${yesNo(app.claudeUsed)}`,
    `Cursor: ${yesNo(app.cursorUsed)}`,
    `Antigravity: ${yesNo(app.antigravityUsed)}`,
    `CRM: ${panelUrl(app.panelId)}`,
  ].join('\n')
}

function buildApplicantHtml(app) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;">
      <h2 style="color:#000;">İmpevos Başvurun Alındı</h2>
      <p>Merhaba ${app.fullName},</p>
      <p>İmpevos ekibine yaptığın başvuru başarıyla alınmıştır. Başvurun ekibimiz tarafından incelenecek ve uygun görülmesi halinde seninle iletişime geçilecektir.</p>
      <p>İlgine teşekkür ederiz.</p>
      <p style="color:#888;font-size:12px;margin-top:32px;">İmpevos Teknoloji</p>
    </div>
  `
}

export async function sendJoinTeamNotifications(application, cvPath) {
  const transporter = getTransporter()
  const companyTo = process.env.JOIN_TEAM_EMAIL || process.env.INTERNSHIP_EMAIL || 'impevos@gmail.com'
  const from = process.env.SMTP_USER || companyTo

  if (!transporter) {
    console.warn('--- SMTP AYARLARI EKSİK — E-posta gönderilemedi ---')
    return { simulated: true, failed: true, applicantFailed: true }
  }

  const results = { sent: false, applicantSent: false }

  try {
    await transporter.sendMail({
      from: `"İmpevos Ekip Başvuruları" <${from}>`,
      replyTo: application.email,
      to: companyTo,
      subject: `Yeni İmpevos Ekip Başvurusu - ${application.fullName}`,
      text: buildCompanyText(application),
      html: buildCompanyHtml(application),
      attachments: cvPath
        ? [{ filename: application.cvOriginalName || 'cv.pdf', path: cvPath }]
        : [],
    })
    results.sent = true
    console.log(`📧 Şirket e-postası gönderildi: ${application.fullName} → ${companyTo}`)
  } catch (err) {
    results.failed = true
    results.error = err.message
    console.error(`❌ Şirket e-postası hatası: ${err.message}`)
  }

  try {
    await transporter.sendMail({
      from: `"İmpevos" <${from}>`,
      to: application.email,
      subject: 'İmpevos Başvurun Alındı',
      text: `Merhaba ${application.fullName},\n\nİmpevos ekibine yaptığın başvuru başarıyla alınmıştır. Başvurun ekibimiz tarafından incelenecek ve uygun görülmesi halinde seninle iletişime geçilecektir.\n\nİlgine teşekkür ederiz.\n\nİmpevos Teknoloji`,
      html: buildApplicantHtml(application),
    })
    results.applicantSent = true
    console.log(`📧 Aday bilgilendirme e-postası gönderildi: ${application.email}`)
  } catch (err) {
    results.applicantFailed = true
    results.applicantError = err.message
    console.error(`❌ Aday e-postası hatası: ${err.message}`)
  }

  return results
}
