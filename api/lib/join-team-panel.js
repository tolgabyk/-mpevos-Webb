import { appendMarketingCrmFields, buildMarketingPayload } from './join-team-crm.js'
import {
  getDepartmentLabel,
  getCrmKind,
  getCrmSubmitKind,
  getPresetRoles,
} from './join-team-departments.js'

const TEAM_SUBMIT_URL =
  process.env.JOIN_TEAM_SUBMIT_URL ||
  process.env.TEAM_APPLICATION_SUBMIT_URL ||
  'https://impevosekip.me/api/team-applications/submit'

const REQUEST_TIMEOUT_MS = 45000

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

function yesNo(val) {
  if (val === 'yes' || val === true) return 'Evet'
  if (val === 'no' || val === false) return 'Hayır'
  return val || ''
}

function aiLevel(val) {
  const v = yesNo(val)
  if (v === 'Evet') return 'orta'
  if (v === 'Hayır') return 'yok'
  return v || 'yok'
}

function guessMime(filename) {
  const ext = String(filename).toLowerCase().split('.').pop()
  if (ext === 'pdf') return 'application/pdf'
  if (ext === 'doc') return 'application/msword'
  if (ext === 'docx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  return 'application/octet-stream'
}

function normalizeBody(body) {
  const presets = getPresetRoles(body.applicationType)
  return {
    ...body,
    softwareRole: body.softwareRole || presets.softwareRole || '',
    marketingRole: body.marketingRole || presets.marketingRole || '',
  }
}

function getRoleInterest(body) {
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
    `Yazılım alanı: ${SOFTWARE_ROLE_LABELS[body.softwareRole] || body.softwareRole || '—'}`,
    `Pazarlama rolü: ${MARKETING_ROLE_LABELS[body.marketingRole] || body.marketingRole || '—'}`,
    '',
  ]

  for (const [key, val] of Object.entries(body)) {
    if (key === 'website' || val === '' || val === false || val === undefined || val === null) continue
    lines.push(`${key}: ${val}`)
  }

  return lines.join('\n')
}

function buildBaseFields(body, applicationKind) {
  const weekly =
    body.hoursPerWeek ||
    body.hoursPerWeekMarketing ||
    body.weeklyHoursAP ||
    body.hoursPerWeekOther ||
    '10'

  const fields = {
    application_kind: applicationKind,
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
    role_interest: getRoleInterest(body),
    weekly_hours: weekly,
    cursor: aiLevel(body.cursorUsed),
    claude: aiLevel(body.claudeUsed),
    antigravity: aiLevel(body.antigravityUsed),
  }

  if (body.aiToolsUsage) fields.chatgpt = 'orta'
  if (body.technologies) fields.technologies = body.technologies
  if (body.projectExample) fields.project_example = body.projectExample
  if (body.whyImpevos) fields.why_impevos = body.whyImpevos
  if (body.differentiator) fields.differentiator = body.differentiator
  if (body.softwareRole) {
    fields.software_role = body.softwareRole
    fields.softwareRole = SOFTWARE_ROLE_LABELS[body.softwareRole] || body.softwareRole
  }

  return fields
}

function buildFormData(body, cvBuffer, cvName, { applicationKind, includeMarketing, marketingOptions }) {
  const fd = new FormData()
  const fields = buildBaseFields(body, applicationKind)

  for (const [key, value] of Object.entries(fields)) {
    fd.append(key, value)
  }

  if (includeMarketing) {
    appendMarketingCrmFields(fd, body, { forceDefaults: true, ...marketingOptions })
  }

  if (cvBuffer?.length) {
    fd.append('cv', new Blob([cvBuffer], { type: guessMime(cvName) }), cvName)
  }

  return fd
}

function buildJsonPayload(body, cvBuffer, cvName, options) {
  const fields = buildBaseFields(body, options.applicationKind)
  const payload = { ...fields }

  if (options.includeMarketing) {
    Object.assign(payload, buildMarketingPayload(body, { forceDefaults: true, ...options.marketingOptions }))
  }

  payload.cv_base64 = cvBuffer?.length ? cvBuffer.toString('base64') : ''
  payload.cv_filename = cvName || 'cv.pdf'
  return payload
}

function isRetryable(message) {
  return /zorunlu|required|geçersiz|invalid|müşteri|musteri|sales|b2b|deneyim/i.test(String(message))
}

async function postFormData(body, cvBuffer, cvName, options) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const res = await fetch(TEAM_SUBMIT_URL, {
      method: 'POST',
      headers: { Origin: 'https://impevos.com' },
      body: buildFormData(body, cvBuffer, cvName, options),
      signal: controller.signal,
    })

    const result = await res.json().catch(() => ({}))
    if (!res.ok || result.ok === false) {
      throw new Error(result.message || result.error || `Panel hatası (${res.status})`)
    }
    return { synced: true, panelId: result.id }
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Panel yanıt vermedi')
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

async function postJson(body, cvBuffer, cvName, options) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const res = await fetch(TEAM_SUBMIT_URL, {
      method: 'POST',
      headers: {
        Origin: 'https://impevos.com',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildJsonPayload(body, cvBuffer, cvName, options)),
      signal: controller.signal,
    })

    const result = await res.json().catch(() => ({}))
    if (!res.ok || result.ok === false) {
      throw new Error(result.message || result.error || `Panel hatası (${res.status})`)
    }
    return { synced: true, panelId: result.id }
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Panel yanıt vermedi')
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

function buildAttempts(body) {
  const realKind = getCrmKind(body.applicationType)
  const submitKind = getCrmSubmitKind(body.applicationType)
  const isMarketing = realKind === 'pazarlama'

  const attempts = []

  if (isMarketing) {
    attempts.push({
      label: 'pazarlama+fields+form',
      fn: postFormData,
      options: { applicationKind: realKind, includeMarketing: true, marketingOptions: { customerMeetingsMode: 'evet' } },
    })
    attempts.push({
      label: 'pazarlama+fields+json',
      fn: postJson,
      options: { applicationKind: realKind, includeMarketing: true, marketingOptions: { customerMeetingsMode: 'evet' } },
    })
    attempts.push({
      label: 'diger+form',
      fn: postFormData,
      options: { applicationKind: submitKind, includeMarketing: false },
    })
    attempts.push({
      label: 'diger+json',
      fn: postJson,
      options: { applicationKind: submitKind, includeMarketing: false },
    })
  } else {
    attempts.push({
      label: `${realKind}+form`,
      fn: postFormData,
      options: { applicationKind: realKind, includeMarketing: false },
    })
    attempts.push({
      label: `${realKind}+json`,
      fn: postJson,
      options: { applicationKind: realKind, includeMarketing: false },
    })
    if (realKind !== 'diger') {
      attempts.push({
        label: 'diger+form',
        fn: postFormData,
        options: { applicationKind: 'diger', includeMarketing: false },
      })
    }
  }

  return attempts
}

export async function syncToTeamPanel(body, cvBuffer, cvName) {
  const normalized = normalizeBody(body)
  const attempts = buildAttempts(normalized)
  let lastError = null

  for (const attempt of attempts) {
    try {
      const result = await attempt.fn(normalized, cvBuffer, cvName, attempt.options)
      console.log(`[join-team] panel OK (${attempt.label}):`, normalized.email, result.panelId)
      return result
    } catch (err) {
      lastError = err
      console.warn(`[join-team] panel denemesi başarısız (${attempt.label}):`, err.message)
      if (!isRetryable(err.message)) throw err
    }
  }

  throw lastError || new Error('Başvuru panele iletilemedi')
}
