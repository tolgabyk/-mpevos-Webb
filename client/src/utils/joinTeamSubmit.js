import { apiUrl, parseJsonResponse } from './api.js'
import { submitToTeamPanel } from '../lib/joinTeamPanelSync.js'

export function getJoinTeamSubmitUrl() {
  return apiUrl('/api/join-team/apply')
}

function friendlyError(message) {
  const text = String(message || '')
  if (/zorunlu|required|geçersiz|invalid/i.test(text)) {
    return 'Başvuru şu an iletilemedi. Lütfen birkaç dakika sonra tekrar deneyin.'
  }
  return text || 'Başvuru gönderilemedi. Lütfen tekrar deneyin.'
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

async function submitDirectToPanel(form, cvFile) {
  const payload = {
    ...form,
    voluntaryConsent: form.voluntaryConsent ? 'true' : 'false',
  }
  const panelResult = await submitToTeamPanel(payload, cvFile)
  return {
    res: { ok: true, status: 201 },
    result: {
      ok: true,
      id: panelResult.panelId,
      message: 'Başvurun alındı. İmpevos ekibine ilgin için teşekkürler.',
    },
  }
}

export async function submitJoinTeamApplication(form, cvFile) {
  if (!cvFile) {
    return {
      res: { ok: false, status: 400 },
      result: { error: 'CV yüklemeniz gerekmektedir.' },
    }
  }

  try {
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
      result: { error: friendlyError(result.error || result.message) },
    }
  } catch {
    try {
      return await submitDirectToPanel(form, cvFile)
    } catch (err) {
      return {
        res: { ok: false, status: 502 },
        result: { error: friendlyError(err?.message) },
      }
    }
  }
}

export function isJoinTeamSubmitSuccess(res, result) {
  return res.ok && result.ok === true
}
