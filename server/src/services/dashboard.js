import fs from 'fs'

const FIELD_LABELS = {
  'web-frontend': 'Web Frontend',
  backend: 'Backend',
  'mobile-ios': 'Mobil iOS',
  'mobile-android': 'Mobil Android',
  'ui-ux': 'UI/UX Tasarım',
  ai: 'Yapay Zeka',
  'digital-marketing': 'Dijital Pazarlama',
  'social-media': 'Sosyal Medya',
  'project-management': 'Proje Yönetimi',
  undecided: 'Henüz karar vermedim',
}

const REMOTE_LABELS = { yes: 'Evet', no: 'Hayır', partial: 'Kısmen' }
const MEETING_LABELS = { yes: 'Evet', no: 'Hayır', depends: 'Duruma göre' }
const ENGLISH_LABELS = { beginner: 'Başlangıç', intermediate: 'Orta', good: 'İyi', advanced: 'İleri' }
const HEAR_LABELS = {
  instagram: 'Instagram', linkedin: 'LinkedIn', friend: 'Arkadaş / Tanıdık',
  university: 'Üniversite', google: 'Google / Arama', other: 'Diğer',
}

function buildMessage(application) {
  const lines = [
    ['Yaşadığı Şehir', application.city],
    ['İlçe', application.district],
    ['Not Ortalaması', application.gpa],
    ['İngilizce Seviyesi', ENGLISH_LABELS[application.englishLevel] || application.englishLevel],
    ['Aktif Üniversite Öğrencisi', application.studentStatus === 'yes' ? 'Evet' : application.studentStatus],
    ['Deneyim Alanı', FIELD_LABELS[application.field] || application.field],
    ['Edinmek İstediği Tecrübe', application.experienceGoal],
    ['Geliştirmek İstediği Konu', application.developmentFocus],
    ['Gönüllü Staj Onayı', application.voluntaryConsent ? 'Evet' : 'Hayır'],
    ['Önceki Staj Deneyimi', application.hasPreviousInternship === 'yes' ? 'Evet' : 'Hayır'],
    ['Staj Deneyimi Detayı', application.previousInternshipInfo],
    ['Teknolojiler', application.technologies],
    ['Kendini Tanıtma', application.selfIntro],
    ['Staj Sebebi', application.reason],
    ['GitHub', application.github],
    ['Proje Linki', application.projectLink],
    ['Portfolyo', application.portfolio],
    ['Uzaktan Çalışma', REMOTE_LABELS[application.remoteWork] || application.remoteWork],
    ['Haftalık Aktif Gün', application.daysPerWeek],
    ['Ekip Toplantıları', MEETING_LABELS[application.teamMeetings] || application.teamMeetings],
    ['İmpevos\'u Nereden Duydun', HEAR_LABELS[application.howDidYouHear] || application.howDidYouHear],
    ['Ek Notlar', application.additionalNotes],
  ]

  return lines
    .filter(([, val]) => val?.trim())
    .map(([label, val]) => `${label}:\n${val}`)
    .join('\n\n')
}

function toPanelPayload(application, cvPath) {
  const payload = {
    full_name: application.fullName,
    email: application.email,
    phone: application.phone || '',
    university: application.university || '',
    field_of_study: application.department || FIELD_LABELS[application.field] || application.field || '',
    grade_year: application.grade || '',
    linkedin_url: application.linkedin || application.github || '',
    source: 'impevos.com',
    message: buildMessage(application),
    cv_url: '',
    cv_filename: application.cvOriginalName || 'cv.pdf',
  }

  if (cvPath && fs.existsSync(cvPath)) {
    payload.cv_base64 = fs.readFileSync(cvPath).toString('base64')
  }

  return payload
}

export async function syncToDashboard(application, cvPath) {
  const submitUrl =
    process.env.INTERNSHIP_SUBMIT_URL ||
    process.env.PANEL_SUBMIT_URL ||
    'https://impevosekip.me/api/internship-applications/submit'

  const payload = toPanelPayload(application, cvPath)

  const res = await fetch(submitUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://impevos.com',
    },
    body: JSON.stringify(payload),
  })

  const result = await res.json().catch(() => ({}))

  if (!res.ok || result.ok === false) {
    const msg = result.message || result.error || res.statusText
    throw new Error(`Panel submit hatası (${res.status}): ${msg}`)
  }

  console.log(`✅ Başvuru impevosekip.me paneline gönderildi: ${application.fullName} (id: ${result.id || '—'})`)
  return { synced: true, panelId: result.id }
}
