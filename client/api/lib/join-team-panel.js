import {
  buildJoinTeamFormData,
  buildJoinTeamMessage,
  buildJoinTeamSubmitPayload,
  normalizeJoinTeamBody,
} from './join-team-payload.js'
import { getCrmKind } from './join-team-departments.js'

const TEAM_SUBMIT_URL =
  process.env.JOIN_TEAM_SUBMIT_URL ||
  process.env.TEAM_APPLICATION_SUBMIT_URL ||
  'https://impevosekip.me/api/team-applications/submit'

const REQUEST_TIMEOUT_MS = 45000

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return null
  return { url, key }
}

async function insertViaSupabase(app, cvBuffer, cvName) {
  const config = getSupabaseConfig()
  if (!config) return null

  const track = getCrmKind(app.applicationType)
  const weekly =
    app.hoursPerWeek ||
    app.hoursPerWeekMarketing ||
    app.weeklyHoursAP ||
    app.hoursPerWeekOther ||
    null

  const row = {
    track,
    application_kind: track,
    full_name: app.fullName,
    email: app.email,
    phone: app.phone || null,
    city: app.city || null,
    age: app.age || null,
    education: app.universityInfo || null,
    linkedin_url: app.linkedin || null,
    github_url: app.githubPortfolio || null,
    availability: weekly,
    message: buildJoinTeamMessage(app),
    form_data: {
      ...buildJoinTeamFormData(app),
      cv_filename: cvName || 'cv.pdf',
      cv_base64: cvBuffer.toString('base64'),
      application_type: app.applicationType,
      software_role: app.softwareRole || null,
      marketing_role: app.marketingRole || null,
    },
    volunteer_consent: app.voluntaryConsent,
    source: 'impevos.com',
    status: 'new',
  }

  const res = await fetch(`${config.url}/rest/v1/team_applications`, {
    method: 'POST',
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(row),
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const msg = data?.message || data?.error || data?.hint || `Supabase hatası (${res.status})`
    throw new Error(msg)
  }

  const id = Array.isArray(data) ? data[0]?.id : data?.id
  if (!id) throw new Error('Supabase kaydı oluşturulamadı')
  return { synced: true, panelId: id, via: 'supabase' }
}

async function postToPanel(payload) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const res = await fetch(TEAM_SUBMIT_URL, {
      method: 'POST',
      headers: {
        Origin: 'https://impevos.com',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    const result = await res.json().catch(() => ({}))
    if (!res.ok || result.ok === false) {
      throw new Error(result.message || result.error || `Panel hatası (${res.status})`)
    }

    return { synced: true, panelId: result.id, via: 'api' }
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Panel yanıt vermedi')
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

export async function syncToTeamPanel(body, cvBuffer, cvName) {
  if (!cvBuffer?.length) {
    throw new Error('CV yüklemeniz gerekmektedir')
  }

  const app = normalizeJoinTeamBody(body)

  if (getSupabaseConfig()) {
    try {
      const result = await insertViaSupabase(app, cvBuffer, cvName)
      console.log('[join-team] supabase OK:', app.email, result.panelId)
      return result
    } catch (supabaseErr) {
      console.warn('[join-team] supabase hatası:', supabaseErr.message)
    }
  }

  const payload = buildJoinTeamSubmitPayload(app, cvBuffer, cvName)
  const result = await postToPanel(payload)
  console.log('[join-team] panel OK:', app.email, result.panelId)
  return result
}
