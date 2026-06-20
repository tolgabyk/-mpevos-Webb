import { getDepartmentLabel, getCrmKind, getCrmSubmitKind } from './join-team-departments.js'

const TEAM_SUBMIT_URL =
  process.env.JOIN_TEAM_SUBMIT_URL ||
  process.env.TEAM_APPLICATION_SUBMIT_URL ||
  'https://impevosekip.me/api/team-applications/submit'

const REQUEST_TIMEOUT_MS = 55000

const SOFTWARE_ROLE_LABELS = {
  frontend: 'Frontend', backend: 'Backend', ios: 'iOS', android: 'Android',
  flutter: 'Flutter', 'react-native': 'React Native', 'ui-ux': 'UI/UX',
  ai: 'AI', devops: 'DevOps', fullstack: 'Full Stack', qa: 'QA / Test',
}

const MARKETING_ROLE_LABELS = {
  'sales-rep': 'Satış Temsilcisi',
  'business-dev': 'İş Geliştirme',
  'customer-meetings': 'Müşteri Görüşmeleri',
  'social-media': 'Sosyal Medya',
  'content-creator': 'İçerik Üreticisi',
  'digital-marketing': 'Dijital Pazarlama',
  campaign: 'Reklam ve Kampanya',
  brand: 'Marka İletişimi',
}

function parseBool(val) {
  return val === 'true' || val === true || val === 'yes' || val === 'on'
}

function getDepartment(body) {
  const label = getDepartmentLabel(body.applicationType)
  if (label) return label
  if (body.marketingRole) return MARKETING_ROLE_LABELS[body.marketingRole] || body.marketingRole
  if (body.softwareRole) return SOFTWARE_ROLE_LABELS[body.softwareRole] || body.softwareRole
  return body.applicationType
}

function buildMessage(body) {
  const typeLabel = getDepartmentLabel(body.applicationType) || body.applicationType
  const realKind = getCrmKind(body.applicationType)
  const lines = [
    `[EKİP BAŞVURUSU] — ${typeLabel}`,
    `Departman kategorisi: ${realKind}`,
    '',
  ]
  for (const [key, val] of Object.entries(body)) {
    if (key === 'website' || val === '' || val === false) continue
    lines.push(`${key}: ${val}`)
  }
  return lines.join('\n')
}

function aiLevel(val) {
  if (val === 'yes' || val === true) return 'orta'
  if (val === 'no' || val === false) return 'yok'
  return val || 'yok'
}

function guessMime(filename) {
  const ext = String(filename).toLowerCase().split('.').pop()
  if (ext === 'pdf') return 'application/pdf'
  if (ext === 'doc') return 'application/msword'
  if (ext === 'docx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  return 'application/octet-stream'
}

function buildJsonPayload(body, cvBuffer, cvName) {
  const weekly =
    body.hoursPerWeek || body.hoursPerWeekMarketing || body.hoursPerWeekOther || '10'

  return {
    application_kind: getCrmSubmitKind(body.applicationType),
    full_name: body.fullName,
    email: body.email,
    phone: body.phone || '',
    city: body.city || '',
    age: body.age || '',
    education: body.universityInfo || '',
    linkedin_url: body.linkedin || '',
    github_url: body.githubPortfolio || '',
    availability: weekly,
    message: buildMessage(body),
    volunteer_consent: parseBool(body.voluntaryConsent) ? 'true' : 'false',
    source: 'impevos.com',
    website: '',
    role_interest: getDepartment(body),
    weekly_hours: weekly,
    cursor: aiLevel(body.cursorUsed),
    claude: aiLevel(body.claudeUsed),
    antigravity: aiLevel(body.antigravityUsed),
    chatgpt: body.aiToolsUsage ? 'orta' : 'yok',
    technologies: body.technologies || '-',
    why_impevos: body.whyImpevos || '-',
    differentiator: body.differentiator || '-',
    cv_base64: cvBuffer?.length ? cvBuffer.toString('base64') : '',
    cv_filename: cvName || 'cv.pdf',
  }
}

function buildFormData(body, cvBuffer, cvName) {
  const fd = new FormData()
  const payload = buildJsonPayload(body, cvBuffer, cvName)
  for (const [key, value] of Object.entries(payload)) {
    if (key === 'cv_base64' || key === 'cv_filename') continue
    fd.append(key, value)
  }
  if (cvBuffer?.length) {
    fd.append('cv', new Blob([cvBuffer], { type: guessMime(cvName) }), cvName)
  }
  return fd
}

async function postJson(body, cvBuffer, cvName) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const res = await fetch(TEAM_SUBMIT_URL, {
      method: 'POST',
      headers: {
        Origin: 'https://impevos.com',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildJsonPayload(body, cvBuffer, cvName)),
      signal: controller.signal,
    })

    const result = await res.json().catch(() => ({}))
    if (!res.ok || result.ok === false) {
      throw new Error(result.message || result.error || `Panel hatası (${res.status})`)
    }
    return { synced: true, panelId: result.id }
  } finally {
    clearTimeout(timeout)
  }
}

async function postFormData(body, cvBuffer, cvName) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const res = await fetch(TEAM_SUBMIT_URL, {
      method: 'POST',
      headers: { Origin: 'https://impevos.com' },
      body: buildFormData(body, cvBuffer, cvName),
      signal: controller.signal,
    })

    const result = await res.json().catch(() => ({}))
    if (!res.ok || result.ok === false) {
      throw new Error(result.message || result.error || `Panel hatası (${res.status})`)
    }
    return { synced: true, panelId: result.id }
  } finally {
    clearTimeout(timeout)
  }
}

export async function syncToTeamPanel(body, cvBuffer, cvName) {
  try {
    return await postJson(body, cvBuffer, cvName)
  } catch (jsonErr) {
    console.warn('[join-team] JSON panel hatası, FormData deneniyor:', jsonErr.message)
    return postFormData(body, cvBuffer, cvName)
  }
}
