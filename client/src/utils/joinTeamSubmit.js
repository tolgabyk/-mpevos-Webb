import { submitToTeamPanel } from '../lib/joinTeamPanelSync.js'

export function getJoinTeamSubmitUrl() {
  return (
    import.meta.env.VITE_JOIN_TEAM_SUBMIT_URL ||
    import.meta.env.VITE_TEAM_APPLICATION_SUBMIT_URL ||
    'https://impevosekip.me/api/team-applications/submit'
  )
}

export async function submitJoinTeamApplication(form, cvFile) {
  if (!cvFile) {
    return {
      res: { ok: false, status: 400 },
      result: { error: 'CV yüklemeniz gerekmektedir.' },
    }
  }

  const payload = {
    ...form,
    voluntaryConsent: form.voluntaryConsent ? 'true' : 'false',
  }

  try {
    const panelResult = await submitToTeamPanel(payload, cvFile)
    return {
      res: { ok: true, status: 201 },
      result: {
        ok: true,
        id: panelResult.panelId,
        message: 'Başvurun alındı. İmpevos ekibine ilgin için teşekkürler.',
      },
    }
  } catch (err) {
    const message = err?.message || 'Başvuru gönderilemedi. Lütfen tekrar deneyin.'
    return {
      res: { ok: false, status: 502 },
      result: { error: message },
    }
  }
}

export function isJoinTeamSubmitSuccess(res, result) {
  return res.ok && result.ok === true
}
