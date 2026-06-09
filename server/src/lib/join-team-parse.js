import crypto from 'crypto'

const PERSONAL_FIELDS = ['fullName', 'email', 'phone', 'city', 'age', 'universityInfo', 'linkedin', 'githubPortfolio']
const CONSENT_FIELDS = ['applicationType', 'voluntaryConsent']
const GENERAL_FIELDS = [
  'whyImpevos', 'differentiator', 'disciplineMeaning', 'remoteWork', 'longTermTeam',
  'developmentAreas', 'responsibilityMeaning', 'activeCommunication', 'feedbackOpen',
]
const SOFTWARE_FIELDS = [
  'softwareRole', 'technologies', 'cursorUsed', 'claudeUsed', 'antigravityUsed',
  'aiToolsUsage', 'aiCodingExperience', 'realProjectExperience', 'githubUsed',
  'gitBranchKnowledge', 'teamWork', 'hoursPerWeek', 'dailyReport', 'crmTracking',
  'technicalScore', 'projectExample', 'portfolioLinks',
]
const MARKETING_FIELDS = [
  'marketingExperience', 'businessMeetings', 'phoneFaceToFace', 'socialMediaContent',
  'campaignExperience', 'designTools', 'hoursPerWeekMarketing', 'communicationScore',
  'howToMarketImpevos', 'salesTargets', 'customerTracking',
]
const ACTIVE_PROJECT_FIELDS = [
  'interestedProjects', 'bestPosition', 'deliveryProcessSeen', 'deadlineWork',
  'dailyReportAP', 'crmTrackingAP', 'regularMeetings', 'onTimeDelivery',
  'toolsUsedAP', 'weeklyHoursAP',
]
const OTHER_FIELDS = [
  'departmentInterest', 'departmentExperience', 'organizationSkills', 'regularReporting',
  'teamCommunication', 'toolsUsedOther', 'hoursPerWeekOther', 'contributionIdea',
]

const ALL_OPTIONAL_FIELDS = [
  ...SOFTWARE_FIELDS, ...MARKETING_FIELDS, ...ACTIVE_PROJECT_FIELDS, ...OTHER_FIELDS,
  'website',
]

export const QUESTION_SET_MAP = {
  'software-team': 'software',
  'intern-junior': 'software',
  'marketing-team': 'marketing',
  'active-project-team': 'active-project',
  'other-departments': 'other',
  volunteer: 'other',
}

export function getQuestionSet(applicationType) {
  return QUESTION_SET_MAP[applicationType] || 'other'
}

function trimOrEmpty(v) {
  return (v ?? '').trim()
}

function fieldValue(fields, name) {
  const raw = fields[name]
  if (Array.isArray(raw)) return trimOrEmpty(raw[0])
  return trimOrEmpty(raw)
}

function parseBool(val) {
  return val === 'true' || val === true || val === 'yes' || val === 'on'
}

function validatePhone(phone) {
  const cleaned = phone.replace(/[\s\-().]/g, '')
  return /^(\+90|0)?[0-9]{10,11}$/.test(cleaned) || /^\+?[0-9]{10,15}$/.test(cleaned)
}

function getRequiredCategoryFields(applicationType) {
  const set = getQuestionSet(applicationType)
  if (set === 'software') {
    return ['softwareRole', 'technologies', 'hoursPerWeek', 'projectExample']
  }
  if (set === 'marketing') {
    return ['marketingExperience', 'hoursPerWeekMarketing', 'howToMarketImpevos']
  }
  if (set === 'active-project') {
    return ['interestedProjects', 'bestPosition', 'weeklyHoursAP']
  }
  return ['departmentInterest', 'hoursPerWeekOther', 'contributionIdea']
}

export function parseJoinTeamForm(fields, file) {
  const body = {}
  for (const key of [...PERSONAL_FIELDS, ...CONSENT_FIELDS, ...GENERAL_FIELDS, ...ALL_OPTIONAL_FIELDS]) {
    body[key] = fieldValue(fields, key)
  }

  body.voluntaryConsent = parseBool(body.voluntaryConsent)

  for (const field of PERSONAL_FIELDS) {
    if (!body[field]) throw new Error(`${field} alanı zorunludur`)
  }

  if (!body.applicationType) throw new Error('Başvuru türü seçilmelidir')
  if (!body.voluntaryConsent) throw new Error('Gönüllü çalışma modelini onaylamanız gerekmektedir')

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(body.email)) throw new Error('Geçerli bir e-posta adresi giriniz')
  if (!validatePhone(body.phone)) throw new Error('Geçerli bir telefon numarası giriniz')

  const age = Number(body.age)
  if (Number.isNaN(age) || age < 16 || age > 80) throw new Error('Geçerli bir yaş giriniz')

  if (body.website) throw new Error('Spam algılandı')

  for (const field of GENERAL_FIELDS) {
    if (!body[field]) throw new Error(`${field} alanı zorunludur`)
  }

  for (const field of getRequiredCategoryFields(body.applicationType)) {
    if (!body[field]) throw new Error(`${field} alanı zorunludur`)
  }

  if (!file) throw new Error('CV yüklemeniz gerekmektedir')

  const allowed = ['.pdf', '.doc', '.docx']
  const name = file.originalFilename || file.newFilename || file.originalname || ''
  const ext = name.toLowerCase().slice(name.lastIndexOf('.'))
  if (!allowed.includes(ext)) throw new Error('Sadece PDF, DOC ve DOCX dosyaları kabul edilir')

  const size = file.size || file.filesize
  if (size > 5 * 1024 * 1024) throw new Error('CV dosyası en fazla 5 MB olabilir')

  const application = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'Yeni Başvuru',
    source: 'Web Sitesi',
    ...body,
    cvOriginalName: name || 'cv.pdf',
  }

  const cvPath = file.filepath || file.path

  return { application, cvPath }
}

export function parseJoinTeamBody(reqBody, file) {
  const fields = {}
  for (const [key, val] of Object.entries(reqBody)) {
    fields[key] = val
  }

  const mockFile = file
    ? {
        originalFilename: file.originalname,
        filepath: file.path,
        size: file.size,
      }
    : null

  return parseJoinTeamForm(fields, mockFile)
}
