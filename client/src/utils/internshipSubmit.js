import { apiUrl, parseJsonResponse } from './api'

const PANEL_SUBMIT_URL =
  import.meta.env.VITE_PANEL_SUBMIT_URL ||
  'https://impevosekip.me/api/internship-applications/submit'

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

const VALUE_LABELS = {
  mandatoryInternship: { yes: 'Evet', no: 'Hayır', unsure: 'Emin değilim' },
  hasPreviousInternship: { yes: 'Evet', no: 'Hayır' },
  remoteWork: { yes: 'Evet', no: 'Hayır', partial: 'Kısmen' },
  teamMeetings: { yes: 'Evet', no: 'Hayır', depends: 'Duruma göre' },
  englishLevel: {
    beginner: 'Başlangıç',
    intermediate: 'Orta',
    good: 'İyi',
    advanced: 'İleri',
  },
  howDidYouHear: {
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    friend: 'Arkadaş / Tanıdık',
    university: 'Üniversite',
    google: 'Google / Arama',
    other: 'Diğer',
  },
}

function label(key, value) {
  if (!value) return ''
  return VALUE_LABELS[key]?.[value] || FIELD_LABELS[value] || value
}

function buildMessage(form) {
  const lines = [
    ['Yaşadığı Şehir', form.city],
    ['İlçe', form.district],
    ['Not Ortalaması', form.gpa],
    ['İngilizce Seviyesi', label('englishLevel', form.englishLevel)],
    ['Staj Alanı', label('field', form.field)],
    ['Zorunlu Yaz Stajı', label('mandatoryInternship', form.mandatoryInternship)],
    ['Staj Tarih Aralığı', form.internshipDateRange],
    ['Staj Süresi (İş Günü)', form.internshipWorkDays],
    ['Önceki Staj Deneyimi', label('hasPreviousInternship', form.hasPreviousInternship)],
    ['Staj Deneyimi Detayı', form.previousInternshipInfo],
    ['Teknolojiler', form.technologies],
    ['Kendini Tanıtma', form.selfIntro],
    ['Staj Sebebi', form.reason],
    ['GitHub', form.github],
    ['Proje Linki', form.projectLink],
    ['Portfolyo', form.portfolio],
    ['Uzaktan Çalışma', label('remoteWork', form.remoteWork)],
    ['Haftalık Aktif Gün', form.daysPerWeek],
    ['Ekip Toplantıları', label('teamMeetings', form.teamMeetings)],
    ['İmpevos\'u Nereden Duydun', label('howDidYouHear', form.howDidYouHear)],
    ['Ek Notlar', form.additionalNotes],
  ]

  return lines
    .filter(([, val]) => val?.trim())
    .map(([l, val]) => `${l}:\n${val}`)
    .join('\n\n')
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') {
        resolve(result.split(',')[1] || '')
      } else {
        reject(new Error('CV okunamadı'))
      }
    }
    reader.onerror = () => reject(new Error('CV okunamadı'))
    reader.readAsDataURL(file)
  })
}

function buildPanelPayload(form, cvBase64, cvFilename) {
  return {
    full_name: form.fullName.trim(),
    email: form.email.trim(),
    phone: form.phone?.trim() || '',
    university: form.university?.trim() || '',
    field_of_study: form.department?.trim() || '',
    grade_year: form.grade?.trim() || '',
    linkedin_url: form.linkedin?.trim() || form.github?.trim() || '',
    source: 'impevos.com',
    message: buildMessage(form),
    cv_base64: cvBase64,
    cv_filename: cvFilename,
    form_data: {
      sehir: form.city?.trim() || '',
      ilce: form.district?.trim() || '',
      staj_alani: label('field', form.field),
      zorunlu_yaz_staji: label('mandatoryInternship', form.mandatoryInternship),
      teknolojiler: form.technologies?.trim() || '',
    },
  }
}

export function getInternshipSubmitUrl() {
  if (import.meta.env.DEV) {
    return apiUrl('/api/internship/apply')
  }
  return PANEL_SUBMIT_URL
}

export async function submitInternshipApplication(form, cvFile) {
  const url = getInternshipSubmitUrl()

  if (import.meta.env.DEV) {
    const data = new FormData()
    Object.entries(form).forEach(([key, val]) => data.append(key, val))
    data.append('cv', cvFile)
    const res = await fetch(url, { method: 'POST', body: data })
    const result = await parseJsonResponse(res)
    return { res, result }
  }

  const cvBase64 = await fileToBase64(cvFile)
  const payload = buildPanelPayload(form, cvBase64, cvFile.name)
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const result = await parseJsonResponse(res)
  return { res, result }
}

export function isInternshipSubmitSuccess(res, result) {
  return res.ok && result.ok === true
}
