import nodemailer from 'nodemailer'

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })
}

const FIELD_LABELS = {
  fullName: 'Ad Soyad',
  email: 'E-posta',
  phone: 'Telefon',
  city: 'Şehir',
  district: 'İlçe',
  university: 'Üniversite',
  department: 'Bölüm',
  grade: 'Sınıf',
  gpa: 'Not Ortalaması',
  englishLevel: 'İngilizce Seviyesi',
  studentStatus: 'Aktif Üniversite Öğrencisi',
  field: 'Deneyim Alanı',
  experienceGoal: 'Edinmek İstediği Tecrübe',
  developmentFocus: 'Geliştirmek İstediği Konu',
  hasPreviousInternship: 'Önceki Deneyim',
  previousInternshipInfo: 'Deneyim Detayı',
  technologies: 'Denediği Araçlar ve Teknolojiler',
  selfIntro: 'Kendini Tanıtma',
  reason: 'Gönüllü Staj Sebebi',
  projectLink: 'Proje Linki',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  portfolio: 'Portfolyo',
  remoteWork: 'Uzaktan Çalışma',
  daysPerWeek: 'Haftalık Aktif Gün',
  teamMeetings: 'Ekip Toplantıları',
  howDidYouHear: 'İmpevos\'u Nereden Duydun',
  additionalNotes: 'Ek Notlar',
  voluntaryConsent: 'Gönüllü Staj Onayı',
  rulesAccepted: 'Şartlar Onayı',
}

const INTERNSHIP_RECIPIENTS = ['burak.gokce@impevos.com.tr', 'kariyer@impevos.com.tr']

function internshipRecipients() {
  const fromEnv = [process.env.INTERNSHIP_EMAIL, process.env.CAREER_EMAIL]
    .flatMap((value) => String(value || '').split(/[,;]/))
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
  return [...new Set([...INTERNSHIP_RECIPIENTS, ...fromEnv])]
}

const VALUE_LABELS = {
  studentStatus: { yes: 'Evet', no: 'Hayır' },
  voluntaryConsent: { true: 'Evet', false: 'Hayır' },
  rulesAccepted: { true: 'Evet', false: 'Hayır' },
  mandatoryInternship: { yes: 'Evet', no: 'Hayır', unsure: 'Emin değilim' },
  hasPreviousInternship: { yes: 'Evet', no: 'Hayır' },
  remoteWork: { yes: 'Evet', no: 'Hayır', partial: 'Kısmen' },
  teamMeetings: { yes: 'Evet', no: 'Hayır', depends: 'Duruma göre' },
  englishLevel: { beginner: 'Başlangıç', intermediate: 'Orta', good: 'İyi', advanced: 'İleri' },
  howDidYouHear: {
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    friend: 'Arkadaş / Tanıdık',
    university: 'Üniversite',
    google: 'Google / Arama',
    other: 'Diğer',
  },
  field: {
    'web-frontend': 'Web Frontend',
    backend: 'Backend',
    'mobile-ios': 'Mobil iOS',
    'mobile-android': 'Mobil Android',
    'ui-ux': 'UI/UX Tasarım',
    ai: 'Yapay Zeka',
    'digital-marketing': 'Dijital Pazarlama',
    'social-media': 'Sosyal Medya',
    'project-management': 'Proje Yönetimi',
    undecided: 'Henüz karar vermedim',
  },
}

function formatValue(key, value) {
  if (value === true || value === false) return value ? 'Evet' : 'Hayır'
  if (!value) return '—'
  return VALUE_LABELS[key]?.[value] || value
}

function buildHtml(application) {
  const rows = Object.entries(FIELD_LABELS)
    .map(([key, label]) => {
      const val = formatValue(key, application[key])
      return `<tr><td style="padding:8px 12px;border:1px solid #eee;font-weight:600;">${label}</td><td style="padding:8px 12px;border:1px solid #eee;">${val.replace(/\n/g, '<br/>')}</td></tr>`
    })
    .join('')

  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:640px;">
      <h2 style="color:#000;">Yeni Uzun Dönem Staj Başvurusu</h2>
      <p style="color:#666;">Web sitesinden yeni bir uzun dönem gönüllü staj başvurusu alındı.</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px;">${rows}</table>
      <p style="margin-top:24px;color:#888;font-size:12px;">Başvuru ID: ${application.id}</p>
    </div>
  `
}

function buildText(application) {
  return Object.entries(FIELD_LABELS)
    .map(([key, label]) => `${label}: ${formatValue(key, application[key])}`)
    .join('\n')
}

export async function sendInternshipNotification(application, cvPath) {
  const transporter = getTransporter()
  const to = internshipRecipients()

  const mailOptions = {
    from: `"İmpevos Staj Başvuruları" <${process.env.SMTP_USER || 'kariyer@impevos.com.tr'}>`,
    replyTo: application.email,
    to,
    subject: `[Uzun Dönem Staj] ${application.fullName} — ${formatValue('field', application.field)}`,
    text: buildText(application),
    html: buildHtml(application),
    attachments: cvPath ? [{ filename: application.cvOriginalName || 'cv.pdf', path: cvPath }] : [],
  }

  if (!transporter) {
    console.warn('--- SMTP AYARLARI EKSİK — E-posta gönderilemedi ---')
    console.warn(`Alıcı: ${to} | Başvuran: ${application.fullName}`)
    return { simulated: true, failed: true }
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`📧 E-posta gönderildi: ${application.fullName} → ${to}`)
    return { sent: true }
  } catch (err) {
    console.error(`❌ E-posta hatası (${err.message})`)
    return { failed: true, error: err.message }
  }
}
