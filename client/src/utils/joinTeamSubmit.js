import { apiUrl, parseJsonResponse } from './api'

const TEAM_SUBMIT_URL =
  import.meta.env.VITE_JOIN_TEAM_SUBMIT_URL ||
  import.meta.env.VITE_TEAM_APPLICATION_SUBMIT_URL ||
  'https://impevosekip.me/api/team-applications/submit'

const TYPE_LABELS = {
  'software-team': 'Yazılım Ekibi',
  'marketing-team': 'Pazarlama Ekibi',
  'active-project-team': 'Aktif Proje Ekibi',
  'other-departments': 'Diğer Departmanlar',
  'intern-junior': 'Stajyer / Junior Geliştirici',
  volunteer: 'Gönüllü / Deneyim Kazanmak İstiyorum',
}

const KIND_MAP = {
  'software-team': 'yazilim',
  'marketing-team': 'pazarlama',
  'active-project-team': 'aktif_proje',
  'other-departments': 'diger',
  'intern-junior': 'stajyer_junior',
  volunteer: 'gonullu',
}

const SOFTWARE_ROLE_LABELS = {
  frontend: 'Frontend', backend: 'Backend', ios: 'iOS', android: 'Android',
  flutter: 'Flutter', 'react-native': 'React Native', 'ui-ux': 'UI/UX',
  ai: 'AI', devops: 'DevOps', fullstack: 'Full Stack', qa: 'QA / Test',
}

function getDepartment(form) {
  if (form.softwareRole) return SOFTWARE_ROLE_LABELS[form.softwareRole] || form.softwareRole
  if (form.departmentInterest) return form.departmentInterest
  if (form.bestPosition) return form.bestPosition
  return TYPE_LABELS[form.applicationType] || form.applicationType
}

function aiLevel(val) {
  if (val === 'yes' || val === true) return 'orta'
  if (val === 'no' || val === false) return 'yok'
  return val || 'yok'
}

function buildMessage(form) {
  const typeLabel = TYPE_LABELS[form.applicationType] || form.applicationType
  const lines = [`[EKİP BAŞVURUSU] — ${typeLabel}`, '']
  for (const [key, val] of Object.entries(form)) {
    if (key === 'website' || val === '' || val === false) continue
    lines.push(`${key}: ${val}`)
  }
  return lines.join('\n')
}

function buildTeamFormData(form, cvFile) {
  const fd = new FormData()
  const weekly =
    form.hoursPerWeek || form.hoursPerWeekMarketing || form.weeklyHoursAP || form.hoursPerWeekOther || ''

  fd.append('application_kind', KIND_MAP[form.applicationType] || 'diger')
  fd.append('full_name', form.fullName.trim())
  fd.append('email', form.email.trim())
  fd.append('phone', form.phone?.trim() || '')
  fd.append('city', form.city?.trim() || '')
  fd.append('age', String(form.age || ''))
  fd.append('education', form.universityInfo?.trim() || '')
  fd.append('linkedin_url', form.linkedin?.trim() || '')
  fd.append('github_url', form.githubPortfolio?.trim() || '')
  fd.append('availability', weekly)
  fd.append('message', buildMessage(form))
  fd.append('volunteer_consent', form.voluntaryConsent ? 'true' : 'false')
  fd.append('source', 'impevos.com')
  fd.append('website', '')
  fd.append('role_interest', getDepartment(form))
  fd.append('weekly_hours', weekly)
  fd.append('cursor', aiLevel(form.cursorUsed))
  fd.append('claude', aiLevel(form.claudeUsed))
  fd.append('antigravity', aiLevel(form.antigravityUsed))
  if (form.whyImpevos) fd.append('why_impevos', form.whyImpevos)
  if (form.differentiator) fd.append('differentiator', form.differentiator)
  if (cvFile) fd.append('cv', cvFile)
  return fd
}

export function getJoinTeamSubmitUrl() {
  if (import.meta.env.DEV) return apiUrl('/api/join-team/apply')
  return TEAM_SUBMIT_URL
}

async function submitViaLocalApi(form, cvFile) {
  const payload = { ...form, voluntaryConsent: form.voluntaryConsent ? 'true' : 'false' }
  const data = new FormData()
  Object.entries(payload).forEach(([key, val]) => data.append(key, val))
  data.append('cv', cvFile)
  const res = await fetch(apiUrl('/api/join-team/apply'), { method: 'POST', body: data })
  const result = await parseJsonResponse(res)
  return { res, result }
}

async function submitViaPanel(form, cvFile) {
  const res = await fetch(TEAM_SUBMIT_URL, {
    method: 'POST',
    body: buildTeamFormData(form, cvFile),
  })
  const result = await parseJsonResponse(res)
  return { res, result }
}

export async function submitJoinTeamApplication(form, cvFile) {
  if (import.meta.env.DEV) {
    return submitViaLocalApi(form, cvFile)
  }
  return submitViaPanel(form, cvFile)
}

export function isJoinTeamSubmitSuccess(res, result) {
  return res.ok && result.ok === true
}
