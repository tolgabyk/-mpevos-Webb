import { apiUrl, parseJsonResponse } from './api'

const PANEL_SUBMIT_URL =
  import.meta.env.VITE_JOIN_TEAM_SUBMIT_URL ||
  import.meta.env.VITE_PANEL_JOIN_TEAM_URL ||
  'https://impevosekip.me/api/team-applications/submit'

const SPAM_KEY = 'impevos-join-team-last-submit'
const SPAM_COOLDOWN_MS = 24 * 60 * 60 * 1000

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

const TYPE_LABELS = {
  'software-team': 'Yazılım Ekibi',
  'marketing-team': 'Pazarlama Ekibi',
  'active-project-team': 'Aktif Proje Ekibi',
  'other-departments': 'Diğer Departmanlar',
  'intern-junior': 'Stajyer / Junior Geliştirici',
  volunteer: 'Gönüllü / Deneyim Kazanmak İstiyorum',
}

function buildMessage(form) {
  const skip = new Set(['website', 'voluntaryConsent'])
  return Object.entries(form)
    .filter(([k, v]) => !skip.has(k) && v !== '' && v !== false)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
}

function buildPanelPayload(form, cvBase64, cvFilename) {
  return {
    full_name: form.fullName.trim(),
    email: form.email.trim(),
    phone: form.phone?.trim() || '',
    city: form.city?.trim() || '',
    university: form.universityInfo?.trim() || '',
    linkedin_url: form.linkedin?.trim() || '',
    github_url: form.githubPortfolio?.trim() || '',
    source: 'Web Sitesi',
    status: 'Yeni Başvuru',
    application_type: TYPE_LABELS[form.applicationType] || form.applicationType,
    voluntary_consent: !!form.voluntaryConsent,
    message: buildMessage(form),
    cv_base64: cvBase64,
    cv_filename: cvFilename,
    form_data: {
      basvuru_turu: TYPE_LABELS[form.applicationType] || form.applicationType,
      gonullu_onay: form.voluntaryConsent ? 'Evet' : 'Hayır',
      claude: form.claudeUsed,
      cursor: form.cursorUsed,
      antigravity: form.antigravityUsed,
      haftalik_saat: form.hoursPerWeek || form.hoursPerWeekMarketing || form.weeklyHoursAP || form.hoursPerWeekOther || '',
    },
  }
}

export function getJoinTeamSubmitUrl() {
  if (import.meta.env.DEV) return apiUrl('/api/join-team/apply')
  if (import.meta.env.VITE_JOIN_TEAM_API_URL) return import.meta.env.VITE_JOIN_TEAM_API_URL
  return '/api/join-team/apply'
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
  const payload = { ...form, voluntaryConsent: form.voluntaryConsent ? 'true' : 'false' }

  if (import.meta.env.DEV) {
    const data = new FormData()
    Object.entries(payload).forEach(([key, val]) => data.append(key, val))
    data.append('cv', cvFile)
    const res = await fetch(url, { method: 'POST', body: data })
    const result = await parseJsonResponse(res)
    if (res.ok && result.ok !== false) markSubmitted(form.email)
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
  if (res.ok && result.ok !== false) markSubmitted(form.email)
  return { res, result }
}
