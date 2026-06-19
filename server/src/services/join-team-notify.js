import { sendJoinTeamNotifications } from './join-team-email.js'
import { syncJoinTeamToDashboard } from './join-team-dashboard.js'

async function withRetry(fn, label, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await fn()
      if (result?.failed || result?.skipped) {
        if (i < retries - 1) {
          await new Promise(r => setTimeout(r, 1500))
          continue
        }
      }
      return result
    } catch (err) {
      console.error(`❌ ${label} deneme ${i + 1}/${retries}:`, err.message)
      if (i === retries - 1) throw err
      await new Promise(r => setTimeout(r, 1500))
    }
  }
}

export async function notifyJoinTeamApplication(application, cvPath) {
  const results = { email: null, panel: null }

  const [emailResult, panelResult] = await Promise.allSettled([
    withRetry(() => sendJoinTeamNotifications(application, cvPath), 'E-posta', 1),
    withRetry(() => syncJoinTeamToDashboard(application, cvPath), 'CRM Panel', 1),
  ])

  if (emailResult.status === 'fulfilled') {
    results.email = emailResult.value
  } else {
    results.email = { failed: true, error: emailResult.reason?.message }
  }

  if (panelResult.status === 'fulfilled') {
    results.panel = panelResult.value
  } else {
    results.panel = { failed: true, error: panelResult.reason?.message }
  }

  if (results.email?.sent) {
    console.log(`📧 E-posta OK → ${application.fullName}`)
  }
  if (results.panel?.synced) {
    console.log(`✅ CRM OK → ${application.fullName}`)
  }

  return results
}
