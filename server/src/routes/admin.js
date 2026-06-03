import express from 'express'
import fs from 'fs'
import path from 'path'
import { createSession, requireAuth, verifyPassword } from '../middleware/auth.js'
import { getApplications, getApplicationById, updateApplication } from '../db.js'
import { CV_DIR } from '../config.js'
const router = express.Router()

router.post('/login', (req, res) => {
  const { password } = req.body
  if (!verifyPassword(password)) {
    return res.status(401).json({ error: 'Geçersiz şifre' })
  }
  const token = createSession()
  res.json({ token })
})

router.get('/applications', requireAuth, (req, res) => {
  const { status, field, university, mandatoryInternship } = req.query
  const applications = getApplications({ status, field, university, mandatoryInternship })
  res.json(applications)
})

router.get('/applications/:id', requireAuth, (req, res) => {
  const application = getApplicationById(req.params.id)
  if (!application) return res.status(404).json({ error: 'Başvuru bulunamadı' })
  res.json(application)
})

router.patch('/applications/:id', requireAuth, (req, res) => {
  const { status, adminNotes } = req.body
  try {
    const updated = updateApplication(req.params.id, { status, adminNotes })
    if (!updated) return res.status(404).json({ error: 'Başvuru bulunamadı' })
    res.json(updated)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/applications/:id/cv', requireAuth, (req, res) => {
  const application = getApplicationById(req.params.id)
  if (!application?.cvFilename) {
    return res.status(404).json({ error: 'CV bulunamadı' })
  }

  const cvPath = path.join(CV_DIR, application.cvFilename)
  if (!fs.existsSync(cvPath)) {
    return res.status(404).json({ error: 'CV dosyası bulunamadı' })
  }

  res.download(cvPath, application.cvOriginalName || application.cvFilename)
})

export default router
