import { sendInternshipNotification } from './email.js'
import { syncToDashboard } from './dashboard.js'

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

export async function notifyApplication(application, cvPath) {
  const results = { email: null, panel: null }

  try {
    results.email = await withRetry(
      () => sendInternshipNotification(application, cvPath),
      'E-posta',
    )
  } catch (err) {
    results.email = { failed: true, error: err.message }
  }

  try {
    results.panel = await withRetry(
      () => syncToDashboard(application, cvPath),
      'Panel',
    )
  } catch (err) {
    results.panel = { failed: true, error: err.message }
  }

  if (results.email?.sent) {
    console.log(`📧 E-posta OK → ${application.fullName}`)
  } else {
    console.error(`❌ E-posta BAŞARISIZ → ${application.fullName}`, results.email?.error || '')
  }

  if (results.panel?.synced) {
    console.log(`✅ Panel OK → ${application.fullName} (id: ${results.panel.panelId})`)
  } else {
    console.error(`❌ Panel BAŞARISIZ → ${application.fullName}`, results.panel?.error || '')
  }

  return results
}
