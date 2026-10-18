import crypto from 'crypto'
import { sendInternshipNotification } from '../../server/src/services/email.js'
import { syncToDashboard } from '../../server/src/services/dashboard.js'

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
  return (v ?? '').trim()
}

function fieldValue(fields, name) {
  const raw = fields[name]
  if (Array.isArray(raw)) return trimOrEmpty(raw[0])
  return trimOrEmpty(raw)
}

export function parseInternshipForm(fields, file) {
  const body = {}
  for (const key of [
    ...REQUIRED_FIELDS,
    'district', 'gpa', 'englishLevel', 'previousInternshipInfo',
    'projectLink', 'github', 'linkedin', 'portfolio',
    'howDidYouHear', 'additionalNotes',
    'voluntaryConsent', 'rulesAccepted',
  ]) {
    body[key] = fieldValue(fields, key)
  }

  for (const field of REQUIRED_FIELDS) {
    if (!body[field]) {
      throw new Error(`${field} alanı zorunludur`)
    }
  }

  if (body.studentStatus !== 'yes') {
    throw new Error('Bu program yalnızca aktif üniversite öğrencilerine açıktır')
  }

  if (!accepted(body.voluntaryConsent) || !accepted(body.rulesAccepted)) {
    throw new Error('Gönüllü staj şartlarını kabul etmeniz gerekmektedir')
  }

  if (body.hasPreviousInternship === 'yes' && !body.previousInternshipInfo) {
    throw new Error('previousInternshipInfo alanı zorunludur')
  }

  if (!file) {
    throw new Error('CV yüklemeniz gerekmektedir')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(body.email)) {
    throw new Error('Geçerli bir e-posta adresi giriniz')
  }

  const allowed = ['.pdf', '.doc', '.docx']
  const name = file.originalFilename || file.newFilename || ''
  const ext = name.toLowerCase().slice(name.lastIndexOf('.'))
  if (!allowed.includes(ext)) {
    throw new Error('Sadece PDF, DOC ve DOCX dosyaları kabul edilir')
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('CV dosyası en fazla 5 MB olabilir')
  }

  return {
    application: {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'new',
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      city: body.city,
      district: body.district,
      university: body.university,
      department: body.department,
      grade: body.grade,
      gpa: body.gpa,
      englishLevel: body.englishLevel,
      studentStatus: body.studentStatus,
      experienceGoal: body.experienceGoal,
      developmentFocus: body.developmentFocus,
      voluntaryConsent: accepted(body.voluntaryConsent),
      rulesAccepted: accepted(body.rulesAccepted),
      field: body.field,
      hasPreviousInternship: body.hasPreviousInternship,
      previousInternshipInfo: body.previousInternshipInfo,
      technologies: body.technologies,
      selfIntro: body.selfIntro,
      reason: body.reason,
      projectLink: body.projectLink,
      github: body.github,
      linkedin: body.linkedin,
      portfolio: body.portfolio,
      remoteWork: body.remoteWork,
      daysPerWeek: body.daysPerWeek,
      teamMeetings: body.teamMeetings,
      howDidYouHear: body.howDidYouHear,
      additionalNotes: body.additionalNotes,
      cvOriginalName: file.originalFilename || 'cv.pdf',
    },
    cvPath: file.filepath,
  }
}

async function withRetry(fn, label, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await fn()
      if ((result?.failed || result?.skipped) && i < retries - 1) {
        await new Promise(r => setTimeout(r, 1500))
        continue
      }
      return result
    } catch (err) {
      if (i === retries - 1) throw err
      await new Promise(r => setTimeout(r, 1500))
    }
  }
}

export async function notifyApplication(application, cvPath) {
  const results = { email: null, panel: null }

  try {
    results.email = await withRetry(
      () => sendInternshipNotification(application, cvPath),
      'E-posta',
    )
  } catch (err) {
    results.email = { failed: true, error: err.message }
  }

  try {
    results.panel = await withRetry(
      () => syncToDashboard(application, cvPath),
      'Panel',
    )
  } catch (err) {
    results.panel = { failed: true, error: err.message }
  }

  return results
}
