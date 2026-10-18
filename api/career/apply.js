import formidable from 'formidable'
import fs from 'fs'
import nodemailer from 'nodemailer'

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let cvPath = null
  try {
    const form = formidable({ maxFileSize: 5 * 1024 * 1024, keepExtensions: true })
    const [fields, files] = await form.parse(req)
    const value = (key) => {
      const raw = fields[key]
      return (Array.isArray(raw) ? raw[0] : raw || '').trim()
    }
    const name = value('name')
    const university = value('university')
    const department = value('department')
    const file = files.cv?.[0]
    cvPath = file?.filepath

    if (!name || !university || !department || !file) {
      return res.status(400).json({ error: 'Ad, üniversite, bölüm ve CV zorunludur.' })
    }

    const ext = (file.originalFilename || '').toLowerCase().split('.').pop()
    if (!['pdf', 'doc', 'docx'].includes(ext)) {
      return res.status(400).json({ error: 'Sadece PDF, DOC ve DOCX dosyaları kabul edilir.' })
    }

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(503).json({ error: 'Mail is not configured' })
    }

    const port = Number(process.env.SMTP_PORT) || 587
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      tls: { rejectUnauthorized: false },
    })

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: ['burak.gokce@impevos.com.tr', 'kariyer@impevos.com.tr'],
      subject: `[Staj Başvurusu] ${name}`,
      text: `Ad: ${name}\nÜniversite: ${university}\nBölüm: ${department}`,
      attachments: [{ filename: file.originalFilename || 'cv.pdf', path: file.filepath }],
    })

    return res.status(201).json({ ok: true })
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Başvuru gönderilemedi.' })
  } finally {
    if (cvPath && fs.existsSync(cvPath)) fs.unlink(cvPath, () => {})
  }
}
