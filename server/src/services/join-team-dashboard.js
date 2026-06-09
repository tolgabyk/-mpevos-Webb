import fs from 'fs'

const APPLICATION_TYPE_LABELS = {
  'software-team': 'Yazılım Ekibi',
  'marketing-team': 'Pazarlama Ekibi',
  'active-project-team': 'Aktif Proje Ekibi',
  'other-departments': 'Diğer Departmanlar',
  'intern-junior': 'Stajyer / Junior Geliştirici',
  volunteer: 'Gönüllü / Deneyim Kazanmak İstiyorum',
}

const APPLICATION_KIND_MAP = {
  'software-team': 'yazilim',
  'marketing-team': 'pazarlama',
  'active-project-team': 'aktif_proje',
  'other-departments': 'diger',
  'intern-junior': 'stajyer_junior',
  volunteer: 'gonullu',
}

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

const TEAM_SUBMIT_URL =
  process.env.JOIN_TEAM_SUBMIT_URL ||
  process.env.TEAM_APPLICATION_SUBMIT_URL ||
  'https://impevosekip.me/api/team-applications/submit'

function yesNo(val) {
  if (val === 'yes' || val === true) return 'Evet'
  if (val === 'no' || val === false) return 'Hayır'
  return val || ''
}

function aiLevel(val) {
  const v = yesNo(val)
  if (v === 'Evet') return 'orta'
  if (v === 'Hayır') return 'yok'
  return v
}

function buildMessage(app) {
  const lines = [
    ['Başvuru Türü', APPLICATION_TYPE_LABELS[app.applicationType] || app.applicationType],
    ['Yaş', app.age],
    ['Üniversite / Bölüm / Mezuniyet', app.universityInfo],
    ['LinkedIn', app.linkedin],
    ['GitHub / Portfolyo', app.githubPortfolio],
    ['Gönüllü Çalışma Onayı', app.voluntaryConsent ? 'Evet' : 'Hayır'],
    ['Teknik Alan', SOFTWARE_ROLE_LABELS[app.softwareRole] || app.softwareRole],
    ['Departman İlgisi', app.departmentInterest],
    ['Teknolojiler', app.technologies],
    ['Cursor', yesNo(app.cursorUsed)],
    ['Claude', yesNo(app.claudeUsed)],
    ['Antigravity', yesNo(app.antigravityUsed)],
    ['AI Araç Kullanımı', app.aiToolsUsage],
    ['AI Kod Deneyimi', app.aiCodingExperience],
    ['Gerçek Proje Deneyimi', yesNo(app.realProjectExperience)],
    ['GitHub Kullanımı', yesNo(app.githubUsed)],
    ['Git / Branch', yesNo(app.gitBranchKnowledge)],
    ['Takım Çalışması', yesNo(app.teamWork)],
    ['Haftalık Saat', app.hoursPerWeek || app.hoursPerWeekMarketing || app.weeklyHoursAP || app.hoursPerWeekOther],
    ['Günlük Rapor', yesNo(app.dailyReport || app.dailyReportAP)],
    ['CRM Görev Takibi', yesNo(app.crmTracking || app.crmTrackingAP)],
    ['Teknik Puan (1-10)', app.technicalScore],
    ['Örnek Proje', app.projectExample],
    ['Portfolyo Linkleri', app.portfolioLinks],
    ['Pazarlama Deneyimi', app.marketingExperience],
    ['İşletme Görüşmeleri', yesNo(app.businessMeetings)],
    ['Telefon / Yüz Yüze', yesNo(app.phoneFaceToFace)],
    ['Sosyal Medya İçerik', yesNo(app.socialMediaContent)],
    ['Kampanya Deneyimi', app.campaignExperience],
    ['Tasarım Araçları', app.designTools],
    ['İletişim Puanı (1-10)', app.communicationScore],
    ['İmpevos Pazarlama Fikri', app.howToMarketImpevos],
    ['Satış Hedefleri', yesNo(app.salesTargets)],
    ['Müşteri Takibi', yesNo(app.customerTracking)],
    ['İlgilenilen Projeler', app.interestedProjects],
    ['En İyi Pozisyon', app.bestPosition],
    ['Teslim Süreci Deneyimi', yesNo(app.deliveryProcessSeen)],
    ['Deadline Uyumu', yesNo(app.deadlineWork)],
    ['Düzenli Toplantı', yesNo(app.regularMeetings)],
    ['Zamanında Teslim', yesNo(app.onTimeDelivery)],
    ['Kullanılan Araçlar', app.toolsUsedAP || app.toolsUsedOther],
    ['Departman Deneyimi', app.departmentExperience],
    ['Organizasyon Becerisi', app.organizationSkills],
    ['Düzenli Rapor', yesNo(app.regularReporting)],
    ['Ekip İletişimi', yesNo(app.teamCommunication)],
    ['Katkı Fikri', app.contributionIdea],
    ['Neden İmpevos', app.whyImpevos],
    ['Fark Yaratan Özellik', app.differentiator],
    ['Disiplin Anlayışı', app.disciplineMeaning],
    ['Uzaktan Çalışma', yesNo(app.remoteWork)],
    ['Uzun Vadeli Ekip', yesNo(app.longTermTeam)],
    ['Gelişim Alanları', app.developmentAreas],
    ['Sorumluluk Anlayışı', app.responsibilityMeaning],
    ['Aktif İletişim', yesNo(app.activeCommunication)],
    ['Geri Bildirime Açık', yesNo(app.feedbackOpen)],
  ]

  return lines
    .filter(([, val]) => val !== undefined && val !== null && String(val).trim() !== '')
    .map(([label, val]) => `${label}:\n${val}`)
    .join('\n\n')
}

function getDepartment(app) {
  if (app.softwareRole) return SOFTWARE_ROLE_LABELS[app.softwareRole] || app.softwareRole
  if (app.departmentInterest) return app.departmentInterest
  if (app.bestPosition) return app.bestPosition
  return APPLICATION_TYPE_LABELS[app.applicationType] || app.applicationType
}

function guessMime(filename) {
  const ext = String(filename).toLowerCase().split('.').pop()
  if (ext === 'pdf') return 'application/pdf'
  if (ext === 'doc') return 'application/msword'
  if (ext === 'docx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  return 'application/octet-stream'
}

function buildTeamFormData(app, cvPath) {
  const fd = new FormData()
  const kind = APPLICATION_KIND_MAP[app.applicationType] || 'diger'
  const weekly =
    app.hoursPerWeek || app.hoursPerWeekMarketing || app.weeklyHoursAP || app.hoursPerWeekOther || ''

  fd.append('application_kind', kind)
  fd.append('full_name', app.fullName)
  fd.append('email', app.email)
  fd.append('phone', app.phone || '')
  fd.append('city', app.city || '')
  fd.append('age', app.age || '')
  fd.append('education', app.universityInfo || '')
  fd.append('linkedin_url', app.linkedin || '')
  fd.append('github_url', app.githubPortfolio || '')
  fd.append('availability', weekly)
  fd.append('message', buildMessage(app))
  fd.append('volunteer_consent', app.voluntaryConsent ? 'true' : 'false')
  fd.append('source', 'impevos.com')
  fd.append('website', '')

  fd.append('role_interest', getDepartment(app))
  fd.append('weekly_hours', weekly)
  fd.append('cursor', aiLevel(app.cursorUsed))
  fd.append('claude', aiLevel(app.claudeUsed))
  fd.append('antigravity', aiLevel(app.antigravityUsed))
  if (app.aiToolsUsage) fd.append('chatgpt', 'orta')
  if (app.technologies) fd.append('technologies', app.technologies)
  if (app.whyImpevos) fd.append('why_impevos', app.whyImpevos)
  if (app.differentiator) fd.append('differentiator', app.differentiator)

  if (cvPath && fs.existsSync(cvPath)) {
    const buf = fs.readFileSync(cvPath)
    const name = app.cvOriginalName || 'cv.pdf'
    fd.append('cv', new Blob([buf], { type: guessMime(name) }), name)
  }

  return fd
}

export async function syncJoinTeamToDashboard(application, cvPath) {
  const fd = buildTeamFormData(application, cvPath)

  const res = await fetch(TEAM_SUBMIT_URL, {
    method: 'POST',
    headers: { Origin: 'https://impevos.com' },
    body: fd,
  })

  const result = await res.json().catch(() => ({}))

  if (!res.ok || result.ok === false) {
    const msg = result.message || result.error || res.statusText
    throw new Error(`CRM panel hatası (${res.status}): ${msg}`)
  }

  console.log(`✅ Ekip başvurusu CRM paneline gönderildi: ${application.fullName} (id: ${result.id || '—'})`)
  return { synced: true, panelId: result.id }
}
