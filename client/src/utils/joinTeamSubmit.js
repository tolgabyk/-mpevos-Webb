import { apiUrl, parseJsonResponse } from './api.js'

export function getJoinTeamSubmitUrl() {
  return apiUrl('/api/join-team/apply')
}

function buildFormData(form, cvFile) {
  const data = new FormData()
  for (const [key, val] of Object.entries(form)) {
    if (val === undefined || val === null) continue
    if (typeof val === 'boolean') {
      data.append(key, val ? 'true' : 'false')
    } else {
      data.append(key, String(val))
    }
  }
  data.append('voluntaryConsent', form.voluntaryConsent ? 'true' : 'false')
  data.append('cv', cvFile)
  return data
}

export async function submitJoinTeamApplication(form, cvFile) {
  if (!cvFile) {
    return {
      res: { ok: false, status: 400 },
      result: { error: 'CV yüklemeniz gerekmektedir.' },
    }
  }

  const res = await fetch(getJoinTeamSubmitUrl(), {
    method: 'POST',
    body: buildFormData(form, cvFile),
  })
  const result = await parseJsonResponse(res)

  if (res.ok && result.ok !== false) {
    return {
      res,
      result: {
        ok: true,
        id: result.id,
        message: result.message || 'Başvurun alındı. İmpevos ekibine ilgin için teşekkürler.',
      },
    }
  }

  return {
    res,
    result: {
      error: result.error || result.message || 'Başvuru gönderilemedi. Lütfen tekrar deneyin.',
    },
  }
}

export function isJoinTeamSubmitSuccess(res, result) {
  return res.ok && result.ok === true
}
