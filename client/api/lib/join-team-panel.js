import { appendMarketingCrmFields } from './join-team-crm.js'
import { getDepartmentLabel, getCrmKind } from './join-team-departments.js'

const TEAM_SUBMIT_URL =
  process.env.JOIN_TEAM_SUBMIT_URL ||
  process.env.TEAM_APPLICATION_SUBMIT_URL ||
  'https://impevosekip.me/api/team-applications/submit'

const REQUEST_TIMEOUT_MS = 35000

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
  const lines = [`[EKİP BAŞVURUSU] — ${typeLabel}`, '']
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

function buildFormData(body, cvBuffer, cvName, crmOptions) {
  const fd = new FormData()
  const weekly =
    body.hoursPerWeek || body.hoursPerWeekMarketing || body.hoursPerWeekOther || '10'

  fd.append('application_kind', getCrmKind(body.applicationType))
  fd.append('full_name', body.fullName)
  fd.append('email', body.email)
  fd.append('phone', body.phone || '')
  fd.append('city', body.city || '')
  fd.append('age', body.age || '')
  fd.append('education', body.universityInfo || '')
  fd.append('linkedin_url', body.linkedin || '')
  fd.append('github_url', body.githubPortfolio || '')
  fd.append('availability', weekly)
  fd.append('message', buildMessage(body))
  fd.append('volunteer_consent', parseBool(body.voluntaryConsent) ? 'true' : 'false')
  fd.append('source', 'impevos.com')
  fd.append('website', '')
  fd.append('role_interest', getDepartment(body))
  fd.append('weekly_hours', weekly)
  fd.append('cursor', aiLevel(body.cursorUsed))
  fd.append('claude', aiLevel(body.claudeUsed))
  fd.append('antigravity', aiLevel(body.antigravityUsed))
  fd.append('chatgpt', body.aiToolsUsage ? 'orta' : 'yok')
  fd.append('technologies', body.technologies || '-')
  fd.append('why_impevos', body.whyImpevos || '-')
  fd.append('differentiator', body.differentiator || '-')
  appendMarketingCrmFields(fd, body, crmOptions)

  if (cvBuffer?.length) {
    fd.append('cv', new Blob([cvBuffer], { type: guessMime(cvName) }), cvName)
  }

  return fd
}

async function postFormData(body, cvBuffer, cvName, crmOptions) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const res = await fetch(TEAM_SUBMIT_URL, {
      method: 'POST',
      headers: { Origin: 'https://impevos.com' },
      body: buildFormData(body, cvBuffer, cvName, crmOptions),
      signal: controller.signal,
    })

    const result = await res.json().catch(() => ({}))
    if (!res.ok || result.ok === false) {
      throw new Error(result.message || result.error || `Panel hatası (${res.status})`)
    }
    return { synced: true, panelId: result.id }
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Panel yanıt vermedi. Lütfen tekrar deneyin.')
    }
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

export async function syncToTeamPanel(body, cvBuffer, cvName) {
  return postFormData(body, cvBuffer, cvName, { forceDefaults: true, customerMeetingsMode: 'evet' })
}
