import crypto from 'crypto'
import {
  getQuestionSet,
  getDepartment,
  getMarketingRoleGroup,
} from '../../api/lib/join-team-departments.js'

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
  'marketingRole', 'marketingExperience', 'businessMeetings', 'phoneFaceToFace',
  'b2bSalesExperience', 'coldCallingComfort', 'crmTrackingSales',
  'socialMediaContent', 'campaignExperience', 'designTools', 'contentExamples',
  'platformExperience', 'hoursPerWeekMarketing', 'communicationScore',
  'howToMarketImpevos', 'salesTargets', 'customerTracking',
]

const OTHER_FIELDS = [
  'departmentExperience', 'organizationSkills', 'regularReporting',
  'teamCommunication', 'toolsUsedOther', 'hoursPerWeekOther', 'contributionIdea',
]

const ALL_OPTIONAL_FIELDS = [
  ...SOFTWARE_FIELDS, ...MARKETING_FIELDS, ...OTHER_FIELDS,
  'website',
]

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

const FIELD_ERROR_LABELS = {
  marketingRole: 'Pozisyon seçimi',
  applicationType: 'Departman',
  marketingExperience: 'Satış / pazarlama deneyimi',
  hoursPerWeekMarketing: 'Haftalık çalışma süresi',
  howToMarketImpevos: 'İmpevos tanıtım fikri',
  communicationScore: 'İletişim puanı',
  businessMeetings: 'İşletme görüşmeleri',
  phoneFaceToFace: 'Telefon / yüz yüze görüşme',
  salesTargets: 'Satış hedefleri',
  socialMediaContent: 'Sosyal medya içerik üretimi',
  designTools: 'Tasarım araçları',
  softwareRole: 'Yazılım alanı',
  technologies: 'Teknolojiler',
  hoursPerWeek: 'Haftalık çalışma süresi',
  projectExample: 'Örnek proje',
  interestedProjects: 'İlgilenilen projeler',
  bestPosition: 'Pozisyon',
  weeklyHoursAP: 'Haftalık çalışma süresi',
  departmentInterest: 'Departman seçimi',
  hoursPerWeekOther: 'Haftalık çalışma süresi',
  departmentExperience: 'Departman deneyimi',
  contributionIdea: 'Katkı fikri',
}

function fieldErrorMessage(field) {
  const label = FIELD_ERROR_LABELS[field] || field
  return `${label} alanı zorunludur`
}

function getRequiredCategoryFields(body) {
  const set = getQuestionSet(body.applicationType)
  const dept = getDepartment(body.applicationType)
  const marketingRole = body.marketingRole || dept?.marketingRole || ''

  if (set === 'software') {
    const fields = ['technologies', 'hoursPerWeek', 'projectExample']
    if (!dept?.softwareRole) fields.unshift('softwareRole')
    return fields
  }
  if (set === 'marketing') {
    const base = ['hoursPerWeekMarketing']
    if (!dept?.marketingRole) base.unshift('marketingRole')
    const group = getMarketingRoleGroup(marketingRole)
    if (group === 'sales') {
      return base
    }
    return base
  }
  return ['departmentExperience', 'hoursPerWeekOther', 'contributionIdea']
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

  if (!body.applicationType) throw new Error('Departman seçilmelidir')
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

  for (const field of getRequiredCategoryFields(body)) {
    if (!body[field]) throw new Error(fieldErrorMessage(field))
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
