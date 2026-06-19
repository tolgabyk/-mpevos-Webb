import { appendMarketingCrmFields, buildMarketingPayload } from './joinTeamCrm.js'
import { getDepartmentLabel, getCrmKind } from '../data/joinTeamDepartments.js'

const TEAM_SUBMIT_URL =
  import.meta.env.VITE_JOIN_TEAM_SUBMIT_URL ||
  import.meta.env.VITE_TEAM_APPLICATION_SUBMIT_URL ||
  'https://impevosekip.me/api/team-applications/submit'

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

const CRM_ATTEMPTS = [
  {},
  { forceDefaults: true },
  { forceDefaults: true, customerMeetingsMode: 'evet' },
  { forceDefaults: true, customerMeetingsMode: 'text' },
]

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

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') {
        resolve(result.split(',')[1] || '')
      } else {
        reject(new Error('CV okunamadı'))
      }
    }
    reader.onerror = () => reject(new Error('CV okunamadı'))
    reader.readAsDataURL(file)
  })
}

function buildBaseFields(body) {
  const weekly =
    body.hoursPerWeek || body.hoursPerWeekMarketing || body.hoursPerWeekOther || '10'

  return {
    application_kind: getCrmKind(body.applicationType),
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
  }
}

function buildFormData(body, cvFile, crmOptions) {
  const fd = new FormData()
  const base = buildBaseFields(body)
  for (const [key, value] of Object.entries(base)) {
    fd.append(key, value)
  }
  appendMarketingCrmFields(fd, body, crmOptions)

  if (cvFile) {
    fd.append('cv', cvFile, cvFile.name || 'cv.pdf')
  }

  return fd
}

async function buildJsonPayload(body, cvFile, crmOptions) {
  const marketing = buildMarketingPayload(body, crmOptions)
  const cvBase64 = cvFile ? await fileToBase64(cvFile) : ''

  return {
    ...buildBaseFields(body),
    ...marketing,
    cv_base64: cvBase64,
    cv_filename: cvFile?.name || 'cv.pdf',
    form_data: marketing,
  }
}

async function postToPanel(body, cvFile, crmOptions, useJson) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 45000)

  try {
    const fetchOptions = {
      method: 'POST',
      headers: { Origin: 'https://impevos.com' },
      signal: controller.signal,
    }

    if (useJson) {
      fetchOptions.headers['Content-Type'] = 'application/json'
      fetchOptions.body = JSON.stringify(await buildJsonPayload(body, cvFile, crmOptions))
    } else {
      fetchOptions.body = buildFormData(body, cvFile, crmOptions)
    }

    const res = await fetch(TEAM_SUBMIT_URL, fetchOptions)
    const result = await res.json().catch(() => ({}))

    if (!res.ok || result.ok === false) {
      throw new Error(result.message || result.error || `Panel hatası (${res.status})`)
    }
    return { synced: true, panelId: result.id }
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Panel yanıt vermedi. Lütfen tekrar deneyin.')
    }
    if (err.message === 'Failed to fetch') {
      throw new Error('Başvuru sunucusuna ulaşılamadı. Lütfen tekrar deneyin.')
    }
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

function isRetryableCrmError(message) {
  return /zorunlu|required|geçersiz|invalid/i.test(String(message))
}

export async function submitToTeamPanel(body, cvFile) {
  const plans = []
  for (const crmOptions of CRM_ATTEMPTS) {
    plans.push({ crmOptions, useJson: false })
    plans.push({ crmOptions, useJson: true })
  }

  let lastError = null

  for (const plan of plans) {
    try {
      return await postToPanel(body, cvFile, plan.crmOptions, plan.useJson)
    } catch (err) {
      lastError = err
      if (!isRetryableCrmError(err.message)) {
        throw err
      }
    }
  }

  throw lastError || new Error('Başvuru gönderilemedi. Lütfen tekrar deneyin.')
}
