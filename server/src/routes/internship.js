import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { createApplication } from '../db.js'
import { notifyApplication } from '../services/notify.js'
import { CV_DIR } from '../config.js'

const UPLOAD_DIR = CV_DIR

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${crypto.randomUUID()}${ext}`)
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

const REQUIRED_FIELDS = [
  'fullName', 'email', 'phone', 'city',
  'university', 'department', 'grade', 'studentStatus',
  'field', 'experienceGoal', 'developmentFocus', 'hasPreviousInternship',
  'technologies', 'selfIntro', 'reason',
  'remoteWork', 'daysPerWeek', 'teamMeetings',
]

function accepted(value) {
  return value === true || value === 'true' || value === 'yes' || value === 'on' || value === '1'
}

function trimOrEmpty(v) {
  return v?.trim() || ''
}

router.post('/apply', (req, res) => {
  upload.single('cv')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message })
    }
    handleApply(req, res).catch(err => {
      console.error('Başvuru işleme hatası:', err)
      if (req.file) {
        fs.unlink(path.join(UPLOAD_DIR, req.file.filename), () => {})
      }
      res.status(500).json({ error: 'Başvuru gönderilemedi. Lütfen tekrar deneyin.' })
    })
  })
})

async function handleApply(req, res) {
  try {
    for (const field of REQUIRED_FIELDS) {
      if (!req.body[field]?.trim()) {
        return res.status(400).json({ error: `${field} alanı zorunludur` })
      }
    }

    if (req.body.studentStatus !== 'yes') {
      return res.status(400).json({ error: 'Bu program yalnızca aktif üniversite öğrencilerine açıktır' })
    }

    if (!accepted(req.body.voluntaryConsent) || !accepted(req.body.rulesAccepted)) {
      return res.status(400).json({ error: 'Gönüllü staj şartlarını kabul etmeniz gerekmektedir' })
    }

    if (req.body.hasPreviousInternship === 'yes' && !req.body.previousInternshipInfo?.trim()) {
      return res.status(400).json({ error: 'previousInternshipInfo alanı zorunludur' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'CV yüklemeniz gerekmektedir' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({ error: 'Geçerli bir e-posta adresi giriniz' })
    }

    const cvPath = path.join(UPLOAD_DIR, req.file.filename)

    const application = createApplication({
      fullName: req.body.fullName.trim(),
      email: req.body.email.trim(),
      phone: req.body.phone.trim(),
      city: req.body.city.trim(),
      district: trimOrEmpty(req.body.district),
      university: req.body.university.trim(),
      department: req.body.department.trim(),
      grade: req.body.grade.trim(),
      gpa: trimOrEmpty(req.body.gpa),
      englishLevel: trimOrEmpty(req.body.englishLevel),
      studentStatus: req.body.studentStatus,
      experienceGoal: req.body.experienceGoal.trim(),
      developmentFocus: req.body.developmentFocus.trim(),
      voluntaryConsent: accepted(req.body.voluntaryConsent),
      rulesAccepted: accepted(req.body.rulesAccepted),
      field: req.body.field,
      hasPreviousInternship: req.body.hasPreviousInternship,
      previousInternshipInfo: trimOrEmpty(req.body.previousInternshipInfo),
      technologies: req.body.technologies.trim(),
      selfIntro: req.body.selfIntro.trim(),
      reason: req.body.reason.trim(),
      projectLink: trimOrEmpty(req.body.projectLink),
      github: trimOrEmpty(req.body.github),
      linkedin: trimOrEmpty(req.body.linkedin),
      portfolio: trimOrEmpty(req.body.portfolio),
      remoteWork: req.body.remoteWork,
      daysPerWeek: req.body.daysPerWeek.trim(),
      teamMeetings: req.body.teamMeetings,
      howDidYouHear: trimOrEmpty(req.body.howDidYouHear),
      additionalNotes: trimOrEmpty(req.body.additionalNotes),
      cvFilename: req.file.filename,
      cvOriginalName: req.file.originalname,
    })

    const notifyResults = await notifyApplication(application, cvPath)

    if (!notifyResults.panel?.synced) {
      if (req.file) {
        fs.unlink(path.join(UPLOAD_DIR, req.file.filename), () => {})
      }
      return res.status(502).json({
        error: notifyResults.panel?.error || 'Başvuru panele iletilemedi. Lütfen tekrar deneyin.',
        details: {
          email: notifyResults.email?.error || null,
          panel: notifyResults.panel?.error || null,
        },
      })
    }

    res.status(201).json({
      ok: true,
      id: application.id,
      panelId: notifyResults.panel?.panelId,
      message: 'Başvuru alındı',
      notified: {
        email: !!notifyResults.email?.sent,
        panel: true,
      },
    })
  } catch (err) {
    if (req.file) {
      fs.unlink(path.join(UPLOAD_DIR, req.file.filename), () => {})
    }
    res.status(500).json({ error: err.message || 'Başvuru gönderilemedi' })
  }
}

export default router
