import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { createJoinTeamApplication } from '../db-join-team.js'
import { notifyJoinTeamApplication } from '../services/join-team-notify.js'
import { parseJoinTeamBody } from '../lib/join-team-parse.js'
import { CV_DIR } from '../config.js'

const UPLOAD_DIR = CV_DIR

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `join-${crypto.randomUUID()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowed.includes(ext)) cb(null, true)
    else cb(new Error('Sadece PDF, DOC ve DOCX dosyaları kabul edilir'))
  },
})

const router = express.Router()

router.post('/apply', (req, res) => {
  upload.single('cv')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message })
    handleApply(req, res).catch(err => {
      console.error('Ekip başvurusu hatası:', err)
      if (req.file) fs.unlink(path.join(UPLOAD_DIR, req.file.filename), () => {})
      res.status(500).json({ error: 'Başvuru gönderilemedi. Lütfen tekrar deneyin.' })
    })
  })
})

async function handleApply(req, res) {
  try {
    const { application, cvPath: parsedPath } = parseJoinTeamBody(req.body, req.file)
    const cvPath = req.file ? path.join(UPLOAD_DIR, req.file.filename) : parsedPath

    const saved = createJoinTeamApplication({
      ...application,
      cvFilename: req.file?.filename,
    })

    const notifyResults = await notifyJoinTeamApplication(saved, cvPath)

    if (notifyResults.panel?.panelId) {
      saved.panelId = notifyResults.panel.panelId
    }

    const emailOk = notifyResults.email?.sent || notifyResults.email?.applicantSent
    const panelOk = notifyResults.panel?.synced

    // CRM paneli kapalı olduğu için birincil bildirim burak.gokce@impevos.com.tr adresinedir
    res.status(201).json({
      ok: true,
      id: saved.id,
      panelId: notifyResults.panel?.panelId || saved.id,
      message: 'Başvuru alındı',
      notified: { email: !!emailOk, panel: !!panelOk },
    })
  } catch (err) {
    if (req.file) fs.unlink(path.join(UPLOAD_DIR, req.file.filename), () => {})
    const status = err.message?.includes('Spam') || err.message?.includes('zorunlu') ||
      err.message?.includes('Geçerli') || err.message?.includes('CV') || err.message?.includes('dosya')
      ? 400 : 500
    res.status(status).json({ error: err.message || 'Başvuru gönderilemedi' })
  }
}

export default router
