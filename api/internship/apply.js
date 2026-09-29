import formidable from 'formidable'
import fs from 'fs'
import { parseInternshipForm, notifyApplication } from '../lib/internship-apply.js'

export const config = {
  api: {
    bodyParser: false,
  },
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

export default async function handler(req, res) {
  setCors(res)

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' })
  }

  let cvPath = null

  try {
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024,
      keepExtensions: true,
    })

    const [fields, files] = await form.parse(req)
    const cvFile = files.cv?.[0] || files.CV?.[0] || Object.values(files)[0]?.[0]

    const { application, cvPath: parsedCvPath } = parseInternshipForm(fields, cvFile)
    cvPath = parsedCvPath

    const notifyResults = await notifyApplication(application, cvPath)

    return sendJson(res, 201, {
      ok: true,
      id: application.id,
      panelId: notifyResults.panel?.panelId || application.id,
      message: 'Başvuru alındı',
      notified: {
        email: !!notifyResults.email?.sent,
        panel: !!notifyResults.panel?.synced,
      },
    })
  } catch (err) {
    const message = err.message || 'Başvuru gönderilemedi. Lütfen tekrar deneyin.'
    const status = message.includes('zorunlu') || message.includes('Geçerli') || message.includes('CV') || message.includes('dosya')
      ? 400
      : 500
    return sendJson(res, status, { error: message })
  } finally {
    if (cvPath && fs.existsSync(cvPath)) {
      fs.unlink(cvPath, () => {})
    }
  }
}
