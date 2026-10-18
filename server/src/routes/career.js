import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import os from 'os'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowed.includes(ext)) cb(null, true)
    else cb(new Error('Sadece PDF, DOC ve DOCX dosyaları kabul edilir'))
  },
})

const router = express.Router()

router.post('/apply', upload.single('cv'), async (req, res) => {
  const name = (req.body.name || '').trim()
  const university = (req.body.university || '').trim()
  const department = (req.body.department || '').trim()
  const file = req.file

  if (!name || !university || !department || !file) {
    if (file) fs.unlink(file.path, () => {})
    return res.status(400).json({ error: 'Ad, üniversite, bölüm ve CV zorunludur.' })
  }

  try {
    const to = ['burak.gokce@impevos.com.tr', 'kariyer@impevos.com.tr']
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        tls: { rejectUnauthorized: false },
      })
      await transporter.sendMail({
        from: `"İmpevos Staj" <${process.env.SMTP_USER}>`,
        to,
        subject: `[Staj Başvurusu] ${name}`,
        text: `Ad: ${name}\nÜniversite: ${university}\nBölüm: ${department}`,
        attachments: [{ filename: file.originalname || `${crypto.randomUUID()}.pdf`, path: file.path }],
      })
    } else {
      console.log('SMTP ayarı yok, staj başvurusu simüle edildi:', name, university, department)
    }
    res.status(201).json({ ok: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Başvuru gönderilemedi.' })
  } finally {
    fs.unlink(file.path, () => {})
  }
})

export default router
