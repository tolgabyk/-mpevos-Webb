import crypto from 'crypto'
import fs from 'fs'
import formidable from 'formidable'
import { waitUntil } from '@vercel/functions'
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

function sendJson(res, status, body) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
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

async function notifyInBackground(body, cvBuffer, cvName) {
  let panelId = null
  try {
    const panelResult = await syncToTeamPanel(body, cvBuffer, cvName)
    panelId = panelResult.panelId
    console.log('[join-team] panel OK:', body.email, panelId)
  } catch (err) {
    console.error('[join-team] panel hatası:', err.message)
  }

  try {
    const application = buildApplication(body, cvName, panelId)
    await sendJoinTeamNotifications(application, cvBuffer, cvName)
    console.log('[join-team] e-posta OK:', body.email)
  } catch (err) {
    console.error('[join-team] e-posta hatası:', err.message)
  }
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
    const cvName = cvFile.originalFilename || 'cv.pdf'
    const cvBuffer = fs.readFileSync(cvPath)

    if (cvPath && fs.existsSync(cvPath)) fs.unlinkSync(cvPath)
    cvPath = null

    waitUntil(notifyInBackground(body, cvBuffer, cvName))

    return sendJson(res, 201, {
      ok: true,
      message: 'Başvurun alındı. İmpevos ekibine ilgin için teşekkürler.',
    })
  } catch (err) {
    console.error('[join-team] apply hatası:', err)
    return sendJson(res, 500, { error: err.message || 'Başvuru gönderilemedi' })
  } finally {
    if (cvPath && fs.existsSync(cvPath)) fs.unlink(cvPath, () => {})
  }
}
