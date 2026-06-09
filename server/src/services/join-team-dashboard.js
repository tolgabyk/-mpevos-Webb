import fs from 'fs'

const APPLICATION_TYPE_LABELS = {
  'software-team': 'Yazılım Ekibi',
  'marketing-team': 'Pazarlama Ekibi',
  'active-project-team': 'Aktif Proje Ekibi',
  'other-departments': 'Diğer Departmanlar',
  'intern-junior': 'Stajyer / Junior Geliştirici',
  volunteer: 'Gönüllü / Deneyim Kazanmak İstiyorum',
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

function yesNo(val) {
  if (val === 'yes' || val === true) return 'Evet'
  if (val === 'no' || val === false) return 'Hayır'
  return val || ''
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

function toPanelPayload(app, cvPath) {
  const payload = {
    full_name: app.fullName,
    email: app.email,
    phone: app.phone || '',
    city: app.city || '',
    university: app.universityInfo || '',
    field_of_study: getDepartment(app),
    grade_year: app.age || '',
    linkedin_url: app.linkedin || '',
    github_url: app.githubPortfolio || '',
    source: 'Web Sitesi',
    status: 'Yeni Başvuru',
    application_type: APPLICATION_TYPE_LABELS[app.applicationType] || app.applicationType,
    department: getDepartment(app),
    voluntary_consent: !!app.voluntaryConsent,
    claude_used: yesNo(app.claudeUsed),
    cursor_used: yesNo(app.cursorUsed),
    antigravity_used: yesNo(app.antigravityUsed),
    chatgpt_used: app.aiToolsUsage ? 'Evet' : '',
    hours_per_week: app.hoursPerWeek || app.hoursPerWeekMarketing || app.weeklyHoursAP || app.hoursPerWeekOther || '',
    message: buildMessage(app),
    cv_url: '',
    cv_filename: app.cvOriginalName || 'cv.pdf',
    form_data: {
      basvuru_turu: APPLICATION_TYPE_LABELS[app.applicationType] || app.applicationType,
      departman: getDepartment(app),
      gonullu_onay: app.voluntaryConsent ? 'Evet' : 'Hayır',
      claude: yesNo(app.claudeUsed),
      cursor: yesNo(app.cursorUsed),
      antigravity: yesNo(app.antigravityUsed),
      haftalik_saat: app.hoursPerWeek || app.hoursPerWeekMarketing || app.weeklyHoursAP || app.hoursPerWeekOther || '',
      sehir: app.city || '',
    },
  }

  if (cvPath && fs.existsSync(cvPath)) {
    payload.cv_base64 = fs.readFileSync(cvPath).toString('base64')
  }

  return payload
}

export async function syncJoinTeamToDashboard(application, cvPath) {
  const webhookUrl =
    process.env.JOIN_TEAM_WEBHOOK_URL ||
    process.env.DASHBOARD_WEBHOOK_URL?.replace('internship-applications', 'team-applications') ||
    'https://impevosekip.me/api/team-applications'
  const apiKey = process.env.DASHBOARD_API_KEY || process.env.INTERNSHIP_APPLICATIONS_WEBHOOK_SECRET

  if (!apiKey) {
    console.warn('⚠️  DASHBOARD_API_KEY tanımlı değil → CRM paneline gönderilemedi')
    return { skipped: true }
  }

  const payload = toPanelPayload(application, cvPath)
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
    'x-impevos-webhook-secret': apiKey,
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })

  const result = await res.json().catch(() => ({}))

  if (!res.ok) {
    const msg = result.message || result.error || res.statusText
    throw new Error(`CRM webhook hatası (${res.status}): ${msg}`)
  }

  console.log(`✅ Ekip başvurusu CRM paneline gönderildi: ${application.fullName} (id: ${result.id || '—'})`)
  return { synced: true, panelId: result.id }
}
