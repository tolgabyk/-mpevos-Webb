import crypto from 'crypto'
import { syncToTeamPanel } from './join-team-panel.js'
import { sendJoinTeamNotifications } from './join-team-email.js'

function parseBool(val) {
  return val === 'true' || val === true || val === 'yes' || val === 'on'
}

function buildApplication(body, cvName) {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'Yeni Başvuru',
    source: 'Web Sitesi',
    ...body,
    voluntaryConsent: parseBool(body.voluntaryConsent),
    cvOriginalName: cvName || 'cv.pdf',
  }
}

/** CRM + e-posta — kullanıcı yanıtı döndükten sonra arka planda çalışır */
export async function notifyJoinTeamInBackground(body, cvBuffer, cvName) {
  const application = buildApplication(body, cvName)

  const panelResult = await syncToTeamPanel(body, cvBuffer, cvName).catch(err => {
    console.error('[join-team] CRM hatası:', err.message)
    return null
  })

  if (panelResult?.panelId) {
    application.panelId = panelResult.panelId
    console.log('[join-team] CRM OK:', application.fullName, panelResult.panelId)
  }

  const emailResult = await sendJoinTeamNotifications(application, cvBuffer, cvName).catch(err => {
    console.error('[join-team] E-posta hatası:', err.message)
    return null
  })

  if (emailResult?.sent) {
    console.log('[join-team] Şirket e-postası OK:', application.fullName)
  }
  if (emailResult?.applicantSent) {
    console.log('[join-team] Aday e-postası OK:', application.email)
  }

  return { panel: panelResult, email: emailResult }
}
