import { apiUrl, parseJsonResponse } from './api'

export function getJoinTeamSubmitUrl() {
  return apiUrl('/api/join-team/apply')
}

export async function submitJoinTeamApplication(form, cvFile) {
  if (!cvFile) {
    throw new Error('CV yüklemeniz gerekmektedir.')
  }

  const payload = { ...form, voluntaryConsent: form.voluntaryConsent ? 'true' : 'false' }
  const data = new FormData()
  Object.entries(payload).forEach(([key, val]) => {
    if (val === undefined || val === null) return
    data.append(key, typeof val === 'boolean' ? (val ? 'true' : 'false') : String(val))
  })
  data.append('cv', cvFile)

  let res
  try {
    res = await fetch(apiUrl('/api/join-team/apply'), { method: 'POST', body: data })
  } catch (err) {
    throw new Error('Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.')
  }

  const result = await parseJsonResponse(res)
  return { res, result }
}

export function isJoinTeamSubmitSuccess(res, result) {
  return res.ok && result.ok === true
}
