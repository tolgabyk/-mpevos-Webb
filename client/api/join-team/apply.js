import formidable from 'formidable'
import fs from 'fs'
import crypto from 'crypto'

export const config = {
  api: { bodyParser: false },
}

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
  ai: 'AI', devops: 'DevOps', fullstack: 'Full Stack', qa: 'QA / Test',
}

function fieldValue(fields, name) {
  const raw = fields[name]
  if (Array.isArray(raw)) return (raw[0] ?? '').trim()
  return (raw ?? '').trim()
}

function parseBool(val) {
  return val === 'true' || val === true || val === 'yes' || val === 'on'
}

function getDepartment(body) {
  if (body.softwareRole) return SOFTWARE_ROLE_LABELS[body.softwareRole] || body.softwareRole
  if (body.departmentInterest) return body.departmentInterest
  if (body.bestPosition) return body.bestPosition
  return TYPE_LABELS[body.applicationType] || body.applicationType
}

function buildMessage(body) {
  const typeLabel = TYPE_LABELS[body.applicationType] || body.applicationType
  const lines = [`[EKİP BAŞVURUSU] — ${typeLabel}`, '']
  for (const [key, val] of Object.entries(body)) {
    if (key === 'website' || val === '' || val === false) continue
    lines.push(`${key}: ${val}`)
  }
  return lines.join('\n')
}

function toCrmPayload(body, cvBase64, cvFilename) {
  const typeLabel = TYPE_LABELS[body.applicationType] || body.applicationType
  return {
    full_name: body.fullName,
    email: body.email,
    phone: body.phone || '',
    university: body.universityInfo || '',
    field_of_study: getDepartment(body),
    grade_year: body.age || '',
    linkedin_url: body.linkedin || body.githubPortfolio || '',
    source: 'impevos-web',
    application_type: typeLabel,
    status: 'Yeni Başvuru',
    department: getDepartment(body),
    voluntary_consent: parseBool(body.voluntaryConsent),
    message: buildMessage(body),
    cv_filename: cvFilename,
    cv_base64: cvBase64,
    form_data: {
      basvuru_turu: `Ekip — ${typeLabel}`,
      basvuru_kategorisi: 'ekip',
      basvuru_kaynak: 'Web Sitesi — Ekibe Katıl',
      departman: getDepartment(body),
      gonullu_onay: parseBool(body.voluntaryConsent) ? 'Evet' : 'Hayır',
      sehir: body.city || '',
      claude: body.claudeUsed || '',
      cursor: body.cursorUsed || '',
      antigravity: body.antigravityUsed || '',
      haftalik_saat: body.hoursPerWeek || body.hoursPerWeekMarketing || body.weeklyHoursAP || body.hoursPerWeekOther || '',
    },
  }
}

async function syncToCrm(payload) {
  const webhookUrl =
    process.env.JOIN_TEAM_WEBHOOK_URL ||
    process.env.DASHBOARD_WEBHOOK_URL ||
    'https://impevosekip.me/api/internship-applications'
  const apiKey = process.env.DASHBOARD_API_KEY || process.env.INTERNSHIP_APPLICATIONS_WEBHOOK_SECRET

  if (!apiKey) {
    return { skipped: true, error: 'CRM API anahtarı tanımlı değil' }
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'x-impevos-webhook-secret': apiKey,
    },
    body: JSON.stringify(payload),
  })

  const result = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(result.message || result.error || `CRM hatası (${res.status})`)
  }
  return { synced: true, panelId: result.id }
}

async function syncToCrmPublicSubmit(payload) {
  const submitUrl =
    process.env.JOIN_TEAM_SUBMIT_URL ||
    'https://impevosekip.me/api/internship-applications/submit'

  const res = await fetch(submitUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      source: 'impevos.com',
    }),
  })

  const result = await res.json().catch(() => ({}))
  if (!res.ok || result.ok === false) {
    throw new Error(result.message || result.error || `Panel submit hatası (${res.status})`)
  }
  return { synced: true, panelId: result.id }
}

function sendJson(res, status, body) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.status(status).json(body)
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    return res.status(204).end()
  }
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' })

  let cvPath = null

  try {
    const form = formidable({ maxFileSize: 5 * 1024 * 1024, keepExtensions: true })
    const [fields, files] = await form.parse(req)
    const cvFile = files.cv?.[0] || files.CV?.[0]

    if (!cvFile) return sendJson(res, 400, { error: 'CV yüklemeniz gerekmektedir' })

    const body = {}
    for (const key of Object.keys(fields)) {
      body[key] = fieldValue(fields, key)
    }

    if (body.website) return sendJson(res, 400, { error: 'Spam algılandı' })
    if (!body.fullName || !body.email || !body.phone || !body.applicationType) {
      return sendJson(res, 400, { error: 'Zorunlu alanlar eksik' })
    }
    if (!parseBool(body.voluntaryConsent)) {
      return sendJson(res, 400, { error: 'Gönüllü çalışma onayı gereklidir' })
    }

    cvPath = cvFile.filepath
    const cvBase64 = fs.readFileSync(cvPath).toString('base64')
    const cvFilename = cvFile.originalFilename || 'cv.pdf'
    const payload = toCrmPayload(body, cvBase64, cvFilename)

    let crmResult = null
    try {
      crmResult = await syncToCrm(payload)
    } catch (webhookErr) {
      console.warn('Webhook CRM hatası, public submit deneniyor:', webhookErr.message)
      crmResult = await syncToCrmPublicSubmit(payload)
    }

    return sendJson(res, 201, {
      ok: true,
      id: crmResult?.panelId || crypto.randomUUID(),
      message: 'Başvuru alındı',
      notified: { panel: !!crmResult?.synced },
    })
  } catch (err) {
    return sendJson(res, 500, { error: err.message || 'Başvuru gönderilemedi' })
  } finally {
    if (cvPath && fs.existsSync(cvPath)) fs.unlink(cvPath, () => {})
  }
}
