import { apiUrl, parseJsonResponse } from './api'

const PANEL_FALLBACK_URL =
  import.meta.env.VITE_JOIN_TEAM_SUBMIT_URL ||
  import.meta.env.VITE_TEAM_APPLICATION_SUBMIT_URL ||
  'https://impevosekip.me/api/team-applications/submit'

const TYPE_LABELS = {
  'software-team': 'Yazılım Ekibi',
  'marketing-team': 'Pazarlama Ekibi',
  'active-project-team': 'Aktif Proje Ekibi',
  'other-departments': 'Diğer Departmanlar',
  'intern-junior': 'Stajyer / Junior Geliştirici',
  volunteer: 'Gönüllü / Deneyim Kazanmak İstiyorum',
}

const SOFTWARE_ROLE_LABELS = {
  frontend: 'Frontend', backend: 'Backend', ios: 'iOS', android: 'Android',
  flutter: 'Flutter', 'react-native': 'React Native', 'ui-ux': 'UI/UX',
  ai: 'AI / Yapay Zeka', devops: 'DevOps', fullstack: 'Full Stack', qa: 'QA / Test',
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
    application_type: typeLabel,
    status: 'Yeni Başvuru',
    department: getDepartment(form),
    voluntary_consent: !!form.voluntaryConsent,
    message: buildMessage(form),
    cv_base64: cvBase64,
    cv_filename: cvFilename,
    form_data: {
      basvuru_turu: `Ekip — ${typeLabel}`,
      basvuru_kategorisi: 'ekip',
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
  if (import.meta.env.VITE_JOIN_TEAM_API_URL) return import.meta.env.VITE_JOIN_TEAM_API_URL
  return apiUrl('/api/join-team/apply')
}

async function submitViaFormData(form, cvFile) {
  const payload = { ...form, voluntaryConsent: form.voluntaryConsent ? 'true' : 'false' }
  const data = new FormData()
  Object.entries(payload).forEach(([key, val]) => data.append(key, val))
  data.append('cv', cvFile)
  const res = await fetch(getJoinTeamSubmitUrl(), { method: 'POST', body: data })
  const result = await parseJsonResponse(res)
  return { res, result }
}

async function submitViaPanelFallback(form, cvFile) {
  const cvBase64 = await fileToBase64(cvFile)
  const body = buildPanelPayload(form, cvBase64, cvFile.name)
  const res = await fetch(PANEL_FALLBACK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const result = await parseJsonResponse(res)
  return { res, result }
}

export async function submitJoinTeamApplication(form, cvFile) {
  try {
    const { res, result } = await submitViaFormData(form, cvFile)
    const success = res.ok && (result.ok === true || (result.ok !== false && !result.error))
    if (success) return { res, result }
  } catch {
    /* API erişilemezse panele düş */
  }

  return submitViaPanelFallback(form, cvFile)
}
