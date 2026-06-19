import crypto from 'crypto'
import fs from 'fs'
import formidable from 'formidable'
import { sendJoinTeamNotifications } from '../lib/join-team-email.js'
import { syncToTeamPanel } from '../lib/join-team-panel.js'

export const config = {
  api: { bodyParser: false },
}

function fieldValue(fields, name) {
  const raw = fields[name]
  if (Array.isArray(raw)) return (raw[0] ?? '').trim()
  return (raw ?? '').trim()
}

function parseBool(val) {
  return val === 'true' || val === true || val === 'yes' || val === 'on'
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function sendJson(res, status, body) {
  setCors(res)
  res.status(status).json(body)
}

function buildApplication(body, cvName, panelId) {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'Yeni Başvuru',
    source: 'Web Sitesi',
    ...body,
    voluntaryConsent: parseBool(body.voluntaryConsent),
    cvOriginalName: cvName || 'cv.pdf',
    panelId,
  }
}

export default async function handler(req, res) {
  setCors(res)

  if (req.method === 'OPTIONS') return res.status(204).end()
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
    const cvName = cvFile.originalFilename || 'cv.pdf'
    const cvBuffer = fs.readFileSync(cvPath)

    const panelResult = await syncToTeamPanel(body, cvBuffer, cvName)
    const application = buildApplication(body, cvName, panelResult.panelId)

    sendJoinTeamNotifications(application, cvBuffer, cvName).catch(err => {
      console.error('[join-team] e-posta hatası:', err.message)
    })

    return sendJson(res, 201, {
      ok: true,
      id: panelResult.panelId,
      message: 'Başvurun alındı. İmpevos ekibine ilgin için teşekkürler.',
      notified: { panel: true },
    })
  } catch (err) {
    console.error('[join-team] apply hatası:', err)
    const msg = String(err.message || '')
    if (/zorunlu/i.test(msg)) {
      return sendJson(res, 502, {
        error: 'Başvuru şu an iletilemedi. Lütfen birkaç dakika sonra tekrar deneyin.',
      })
    }
    return sendJson(res, 502, { error: err.message || 'Başvuru gönderilemedi' })
  } finally {
    if (cvPath && fs.existsSync(cvPath)) fs.unlink(cvPath, () => {})
  }
}
