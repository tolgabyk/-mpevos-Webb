import {
  getDepartment as getDeptConfig,
  getDepartmentLabel,
  getCrmKind,
  getPresetRoles,
} from './join-team-departments.js'

const SOFTWARE_ROLE_LABELS = {
  frontend: 'Frontend Developer',
  backend: 'Backend Developer',
  ios: 'iOS Developer',
  android: 'Android Developer',
  'react-native': 'React Native Developer',
  flutter: 'Flutter Developer',
  fullstack: 'Full Stack Developer',
  ai: 'AI / Yapay Zeka Geliştirici',
  'ui-ux': 'UI/UX Designer',
  devops: 'DevOps / Deployment',
  qa: 'QA / Test',
}

const MARKETING_ROLE_LABELS = {
  'sales-rep': 'Satış Temsilcisi',
  'business-dev': 'İş Geliştirme',
  'customer-meetings': 'Müşteri Görüşmeleri',
  'social-media': 'Sosyal Medya',
  'content-creator': 'İçerik Üreticisi',
  'digital-marketing': 'Dijital Pazarlama',
  campaign: 'Reklam ve Kampanya',
  brand: 'Marka İletişimi',
}

function parseBool(val) {
  return val === 'true' || val === true || val === 'yes' || val === 'on'
}

function yesNoTr(val, fallback = 'Evet') {
  if (val === 'yes' || val === true) return 'Evet'
  if (val === 'no' || val === false) return 'Hayır'
  return fallback
}

function aiLevel(val) {
  const v = yesNoTr(val, '')
  if (v === 'Evet') return 'orta'
  if (v === 'Hayır') return 'yok'
  return v || 'yok'
}

function firstText(...values) {
  for (const v of values) {
    const s = String(v ?? '').trim()
    if (s) return s
  }
  return ''
}

export function normalizeJoinTeamBody(body) {
  const presets = getPresetRoles(body.applicationType)
  return {
    ...body,
    softwareRole: body.softwareRole || presets.softwareRole || '',
    marketingRole: body.marketingRole || presets.marketingRole || '',
    voluntaryConsent: parseBool(body.voluntaryConsent),
  }
}

function getDepartment(app) {
  const dept = getDeptConfig(app.applicationType)
  if (dept) return dept.label
  if (app.marketingRole) return MARKETING_ROLE_LABELS[app.marketingRole] || app.marketingRole
  if (app.softwareRole) return SOFTWARE_ROLE_LABELS[app.softwareRole] || app.softwareRole
  return getDepartmentLabel(app.applicationType) || app.applicationType
}

export function buildJoinTeamMessage(app) {
  const lines = [
    ['Başvuru Departmanı', getDepartmentLabel(app.applicationType) || app.applicationType],
    ['Yaş', app.age],
    ['Üniversite / Bölüm / Mezuniyet', app.universityInfo],
    ['LinkedIn', app.linkedin],
    ['GitHub / Portfolyo', app.githubPortfolio],
    ['Teknolojiler', app.technologies],
    ['Departman İlgisi', app.departmentInterest || app.departmentExperience],
    ['Pazarlama Deneyimi', app.marketingExperience],
    ['B2B Satış Deneyimi', app.b2bSalesExperience],
    ['Müşteri Görüşmeleri', yesNoTr(app.phoneFaceToFace || app.businessMeetings)],
    ['Neden İmpevos', app.whyImpevos],
    ['Katkı Fikri', app.contributionIdea],
  ]

  return lines
    .filter(([, val]) => val !== undefined && val !== null && String(val).trim() !== '')
    .map(([label, val]) => `${label}:\n${val}`)
    .join('\n\n')
}

/** Panel API form_data doğrulaması snake_case Türkçe anahtarları okur */
export function buildJoinTeamFormData(app) {
  const deptLabel = getDepartment(app)
  const deptSlug = app.applicationType || ''
  const departmentInterest = firstText(
    app.departmentInterest,
    app.departmentExperience,
    deptLabel,
    'Başvuru formunda belirtildi',
  )
  const salesExperience = firstText(
    app.marketingExperience,
    app.b2bSalesExperience,
    app.departmentExperience,
    'Başvuru formunda belirtildi',
  )
  const b2bExperience = firstText(
    app.b2bSalesExperience,
    app.marketingExperience,
    app.departmentExperience,
    'Başvuru formunda belirtildi',
  )
  const technologies = firstText(app.technologies, 'Başvuru formunda belirtildi')
  const meetingChoice =
    app.phoneFaceToFace === 'no' && app.businessMeetings === 'no' ? 'Hayır' : 'Evet'

  const interestArea = firstText(
    deptSlug,
    app.softwareRole,
    app.marketingRole,
    deptLabel,
    'genel',
  )
  const interestLabel = firstText(
    SOFTWARE_ROLE_LABELS[app.softwareRole],
    MARKETING_ROLE_LABELS[app.marketingRole],
    deptLabel,
    interestArea,
  )

  const formData = {
    application_type: deptSlug,
    basvuru_departmani: deptLabel,
    teknolojiler: technologies,
    ilgilendigi_alan: interestArea,
    ilgilenilen_alan: interestArea,
    ilgilendiği_alan: interestArea,
    ilgi_alani: interestArea,
    interest_area: interestArea,
    interest_field: interestArea,
    software_role: firstText(app.softwareRole, interestArea),
    yazilim_alani: interestArea,
    'İlgilendiği alan': interestLabel,
    departman_ilgisi: departmentInterest,
    'Departman ilgisi': departmentInterest,
    departman_ilgi: departmentInterest,
    departman_deneyimi: firstText(app.departmentExperience, departmentInterest),
    musteri_gorusmesi: meetingChoice,
    'Müşteri görüşmesi': meetingChoice,
    satis_deneyimi: salesExperience,
    'Satış deneyimi': salesExperience,
    b2b_b2c_deneyimi: b2bExperience,
    'B2B / B2C deneyimi': b2bExperience,
    pazarlama_deneyimi: firstText(app.marketingExperience, salesExperience),
    iletisim_puani: firstText(app.communicationScore, '5'),
    impevos_tanitim_fikri: firstText(app.howToMarketImpevos, 'Başvuru formunda belirtildi'),
    ornek_proje: firstText(app.projectExample, 'Başvuru formunda belirtildi'),
    katki_fikri: firstText(app.contributionIdea, 'Başvuru formunda belirtildi'),
    yazilim_alani: interestArea,
    pazarlama_rolu: firstText(
      MARKETING_ROLE_LABELS[app.marketingRole],
      app.marketingRole,
      deptLabel,
    ),
    ilgilenilen_projeler: firstText(app.interestedProjects, deptLabel),
    en_iyi_pozisyon: firstText(app.bestPosition, deptLabel),
    haftalik_saat: firstText(
      app.hoursPerWeek,
      app.hoursPerWeekMarketing,
      app.weeklyHoursAP,
      app.hoursPerWeekOther,
      '10',
    ),
  }

  return formData
}

export function buildJoinTeamSubmitPayload(app, cvBuffer, cvName) {
  const track = getCrmKind(app.applicationType)
  const weekly = firstText(
    app.hoursPerWeek,
    app.hoursPerWeekMarketing,
    app.weeklyHoursAP,
    app.hoursPerWeekOther,
    '10',
  )
  const formData = buildJoinTeamFormData(app)
  const interestArea = formData.ilgilendigi_alan
  const departmentInterest = formData.departman_ilgisi

  return {
    track,
    application_kind: track,
    application_type: app.applicationType,
    full_name: app.fullName,
    email: app.email,
    phone: app.phone || '',
    city: app.city || '',
    age: app.age || '',
    education: app.universityInfo || '',
    linkedin_url: app.linkedin || '',
    github_url: app.githubPortfolio || '',
    availability: weekly,
    message: buildJoinTeamMessage(app),
    volunteer_consent: app.voluntaryConsent,
    source: 'impevos.com',
    role_interest: getDepartment(app),
    ilgilendigi_alan: interestArea,
    interest_area: interestArea,
    departman_ilgisi: departmentInterest,
    weekly_hours: weekly,
    cursor: aiLevel(app.cursorUsed),
    claude: aiLevel(app.claudeUsed),
    antigravity: aiLevel(app.antigravityUsed),
    chatgpt: app.aiToolsUsage ? 'orta' : 'yok',
    form_data: formData,
    cv_base64: cvBuffer.toString('base64'),
    cv_filename: cvName || 'cv.pdf',
  }
}
