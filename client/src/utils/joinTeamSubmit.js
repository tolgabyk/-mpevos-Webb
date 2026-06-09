import { apiUrl, parseJsonResponse } from './api'

// Canlı ortamda staj formuyla aynı panel endpoint'i kullanılır (Origin: impevos.com).
// team-applications/submit hazır olunca VITE_JOIN_TEAM_SUBMIT_URL ile değiştirilebilir.
const PANEL_SUBMIT_URL =
  import.meta.env.VITE_JOIN_TEAM_SUBMIT_URL ||
  import.meta.env.VITE_PANEL_SUBMIT_URL ||
  'https://impevosekip.me/api/internship-applications/submit'

const SPAM_KEY = 'impevos-join-team-last-submit'
const SPAM_COOLDOWN_MS = 24 * 60 * 60 * 1000

const TYPE_LABELS = {
  'software-team': 'Yazılım Ekibi',
  'marketing-team': 'Pazarlama Ekibi',
  'active-project-team': 'Aktif Proje Ekibi',
  'other-departments': 'Diğer Departmanlar',
  'intern-junior': 'Stajyer / Junior Geliştirici',
  volunteer: 'Gönüllü / Deneyim Kazanmak İstiyorum',
}

const SOFTWARE_ROLE_LABELS = {
  frontend: 'Frontend',
  backend: 'Backend',
  ios: 'iOS',
  android: 'Android',
  flutter: 'Flutter',
  'react-native': 'React Native',
  'ui-ux': 'UI/UX',
  ai: 'AI / Yapay Zeka',
  devops: 'DevOps',
  fullstack: 'Full Stack',
  qa: 'QA / Test',
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') resolve(result.split(',')[1] || '')
      else reject(new Error('CV okunamadı'))
    }
    reader.onerror = () => reject(new Error('CV okunamadı'))
    reader.readAsDataURL(file)
  })
}

function getDepartment(form) {
  if (form.softwareRole) return SOFTWARE_ROLE_LABELS[form.softwareRole] || form.softwareRole
  if (form.departmentInterest) return form.departmentInterest
  if (form.bestPosition) return form.bestPosition
  return TYPE_LABELS[form.applicationType] || form.applicationType
}

function buildMessage(form) {
  const typeLabel = TYPE_LABELS[form.applicationType] || form.applicationType
  const lines = [
    `[EKİP BAŞVURUSU] — ${typeLabel}`,
    '',
    `Ad Soyad: ${form.fullName}`,
    `E-posta: ${form.email}`,
    `Telefon: ${form.phone}`,
    `Şehir: ${form.city}`,
    `Yaş: ${form.age}`,
    `Eğitim: ${form.universityInfo}`,
    `LinkedIn: ${form.linkedin || '—'}`,
    `GitHub / Portfolyo: ${form.githubPortfolio || '—'}`,
    `Gönüllü Çalışma Onayı: ${form.voluntaryConsent ? 'Evet' : 'Hayır'}`,
    `Haftalık Süre: ${form.hoursPerWeek || form.hoursPerWeekMarketing || form.weeklyHoursAP || form.hoursPerWeekOther || '—'}`,
    `Cursor: ${form.cursorUsed || '—'}`,
    `Claude: ${form.claudeUsed || '—'}`,
    `Antigravity: ${form.antigravityUsed || '—'}`,
    '',
    '--- Detaylı Yanıtlar ---',
  ]

  const skip = new Set(['website', 'voluntaryConsent', 'fullName', 'email', 'phone', 'city', 'age', 'universityInfo', 'linkedin', 'githubPortfolio', 'applicationType'])
  for (const [key, val] of Object.entries(form)) {
    if (skip.has(key) || val === '' || val === false) continue
    lines.push(`${key}: ${val}`)
  }

  return lines.join('\n')
}

function buildPanelPayload(form, cvBase64, cvFilename) {
  const typeLabel = TYPE_LABELS[form.applicationType] || form.applicationType
  return {
    full_name: form.fullName.trim(),
    email: form.email.trim(),
    phone: form.phone?.trim() || '',
    university: form.universityInfo?.trim() || '',
    field_of_study: getDepartment(form),
    grade_year: String(form.age || '').trim(),
    linkedin_url: form.linkedin?.trim() || form.githubPortfolio?.trim() || '',
    source: 'impevos.com',
    message: buildMessage(form),
    cv_base64: cvBase64,
    cv_filename: cvFilename,
    form_data: {
      basvuru_turu: `Ekip — ${typeLabel}`,
      basvuru_kaynak: 'Web Sitesi — Ekibe Katıl',
      departman: getDepartment(form),
      gonullu_onay: form.voluntaryConsent ? 'Evet' : 'Hayır',
      sehir: form.city?.trim() || '',
      claude: form.claudeUsed || '',
      cursor: form.cursorUsed || '',
      antigravity: form.antigravityUsed || '',
      haftalik_saat: form.hoursPerWeek || form.hoursPerWeekMarketing || form.weeklyHoursAP || form.hoursPerWeekOther || '',
    },
  }
}

export function getJoinTeamSubmitUrl() {
  if (import.meta.env.DEV) return apiUrl('/api/join-team/apply')
  return PANEL_SUBMIT_URL
}

export function checkSpamCooldown(email) {
  try {
    const raw = localStorage.getItem(SPAM_KEY)
    if (!raw) return null
    const { email: lastEmail, ts } = JSON.parse(raw)
    if (lastEmail === email.trim().toLowerCase() && Date.now() - ts < SPAM_COOLDOWN_MS) {
      return 'Bu e-posta adresiyle son 24 saat içinde zaten başvuru yapılmış.'
    }
  } catch {
    /* ignore */
  }
  return null
}

export function markSubmitted(email) {
  try {
    localStorage.setItem(SPAM_KEY, JSON.stringify({ email: email.trim().toLowerCase(), ts: Date.now() }))
  } catch {
    /* ignore */
  }
}

export async function submitJoinTeamApplication(form, cvFile) {
  const spamMsg = checkSpamCooldown(form.email)
  if (spamMsg) return { res: { ok: false, status: 429 }, result: { error: spamMsg } }

  const url = getJoinTeamSubmitUrl()

  if (import.meta.env.DEV) {
    const payload = { ...form, voluntaryConsent: form.voluntaryConsent ? 'true' : 'false' }
    const data = new FormData()
    Object.entries(payload).forEach(([key, val]) => data.append(key, val))
    data.append('cv', cvFile)
    const res = await fetch(url, { method: 'POST', body: data })
    const result = await parseJsonResponse(res)
    if (res.ok && result.ok !== false && !result.error) markSubmitted(form.email)
    return { res, result }
  }

  const cvBase64 = await fileToBase64(cvFile)
  const body = buildPanelPayload(form, cvBase64, cvFile.name)

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const result = await parseJsonResponse(res)

  const success = res.ok && result.ok === true
  if (success) markSubmitted(form.email)

  return { res, result }
}
