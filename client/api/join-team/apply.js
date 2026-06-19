import fs from 'fs'
import { appendMarketingCrmFields } from '../../../api/lib/join-team-crm.js'
import { getDepartmentLabel, getCrmKind } from '../../../api/lib/join-team-departments.js'

export const config = {
  api: { bodyParser: false },
}

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

const TEAM_SUBMIT_URL =
  process.env.JOIN_TEAM_SUBMIT_URL ||
  process.env.TEAM_APPLICATION_SUBMIT_URL ||
  'https://impevosekip.me/api/team-applications/submit'

function fieldValue(fields, name) {
  const raw = fields[name]
  if (Array.isArray(raw)) return (raw[0] ?? '').trim()
  return (raw ?? '').trim()
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

async function syncToTeamPanel(body, cvFile) {
  const fd = new FormData()
  const weekly =
    body.hoursPerWeek || body.hoursPerWeekMarketing || body.hoursPerWeekOther || ''

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
  appendMarketingCrmFields(fd, body)

  if (cvFile?.filepath) {
    const buf = fs.readFileSync(cvFile.filepath)
    const name = cvFile.originalFilename || 'cv.pdf'
    fd.append('cv', new Blob([buf], { type: guessMime(name) }), name)
  }

  const res = await fetch(TEAM_SUBMIT_URL, {
    method: 'POST',
    headers: { Origin: 'https://impevos.com' },
    body: fd,
  })

  const result = await res.json().catch(() => ({}))
  if (!res.ok || result.ok === false) {
    throw new Error(result.message || result.error || `Panel hatası (${res.status})`)
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
    const { default: formidable } = await import('formidable')
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
    const crmResult = await syncToTeamPanel(body, cvFile)

    return sendJson(res, 201, {
      ok: true,
      id: crmResult.panelId,
      message: 'Başvurun alındı. İmpevos ekibine ilgin için teşekkürler.',
      notified: { panel: true },
    })
  } catch (err) {
    return sendJson(res, 500, { error: err.message || 'Başvuru gönderilemedi' })
  } finally {
    if (cvPath && fs.existsSync(cvPath)) fs.unlink(cvPath, () => {})
  }
}
