import { apiUrl, parseJsonResponse } from './api'

export function getJoinTeamSubmitUrl() {
  return apiUrl('/api/join-team/apply')
}

export async function submitJoinTeamApplication(form, cvFile) {
  const payload = { ...form, voluntaryConsent: form.voluntaryConsent ? 'true' : 'false' }
  const data = new FormData()
  Object.entries(payload).forEach(([key, val]) => data.append(key, val))
  data.append('cv', cvFile)
  const res = await fetch(apiUrl('/api/join-team/apply'), { method: 'POST', body: data })
  const result = await parseJsonResponse(res)
  return { res, result }
}

export function isJoinTeamSubmitSuccess(res, result) {
  return res.ok && result.ok === true
}
