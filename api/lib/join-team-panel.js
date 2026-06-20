import crypto from 'crypto'
import {
  buildJoinTeamFormData,
  buildJoinTeamMessage,
  normalizeJoinTeamBody,
} from './join-team-payload.js'
import { getCrmKind } from './join-team-departments.js'

const DEFAULT_SUPABASE_URL = 'https://fgegxtyabtojsupxjdiw.supabase.co'
// Anon key — RLS ile yalnızca team_applications insert izni var (public)
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnZWd4dHlhYnRvanN1cHhqZGl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTA2NDAsImV4cCI6MjA5NzQ2NjY0MH0.Ytb8KriHH_eR-7683_bTu3QEXri02_0XceKd777EBbM'

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    DEFAULT_SUPABASE_ANON_KEY
  return { url, key }
}

function guessMime(filename) {
  const ext = String(filename).toLowerCase().split('.').pop()
  if (ext === 'pdf') return 'application/pdf'
  if (ext === 'doc') return 'application/msword'
  if (ext === 'docx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  return 'application/octet-stream'
}

async function uploadCvToStorage(config, applicationId, cvBuffer, cvName) {
  const safeName = String(cvName || 'cv.pdf').replace(/[^\w.\-()+]/g, '_')
  const path = `${applicationId}/${safeName}`

  const res = await fetch(`${config.url}/storage/v1/object/team-cvs/${path}`, {
    method: 'POST',
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      'Content-Type': guessMime(safeName),
      'x-upsert': 'true',
    },
    body: cvBuffer,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.warn('[join-team] CV storage upload failed:', res.status, text.slice(0, 200))
    return null
  }

  return path
}

async function insertViaSupabase(app, cvBuffer, cvName) {
  const config = getSupabaseConfig()
  const track = getCrmKind(app.applicationType)
  const weekly =
    app.hoursPerWeek ||
    app.hoursPerWeekMarketing ||
    app.weeklyHoursAP ||
    app.hoursPerWeekOther ||
    null

  const applicationId = crypto.randomUUID()
  const cvStoragePath = await uploadCvToStorage(config, applicationId, cvBuffer, cvName)

  const payload = {
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
    message: [
      buildJoinTeamMessage(app),
      cvStoragePath ? `CV: ${cvName}` : `CV dosyası: ${cvName}`,
    ]
      .filter(Boolean)
      .join('\n\n'),
    form_data: {
      ...buildJoinTeamFormData(app),
      cv_filename: cvName || 'cv.pdf',
      cv_storage_path: cvStoragePath,
      application_type: app.applicationType,
      software_role: app.softwareRole || null,
      marketing_role: app.marketingRole || null,
    },
    cv_storage_path: cvStoragePath,
    volunteer_consent: app.voluntaryConsent,
    source: 'impevos.com',
  }

  const res = await fetch(`${config.url}/rest/v1/rpc/submit_team_application`, {
    method: 'POST',
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ payload }),
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const msg =
      data?.message ||
      data?.error ||
      data?.hint ||
      `Supabase kayıt hatası (${res.status})`
    throw new Error(msg)
  }

  const id = typeof data === 'string' ? data : data?.id || data
  if (!id) throw new Error('Supabase kaydı oluşturulamadı')
  return { synced: true, panelId: id, via: 'supabase' }
}

export async function syncToTeamPanel(body, cvBuffer, cvName) {
  if (!cvBuffer?.length) {
    throw new Error('CV yüklemeniz gerekmektedir')
  }

  const app = normalizeJoinTeamBody(body)
  const result = await insertViaSupabase(app, cvBuffer, cvName)
  console.log('[join-team] supabase OK:', app.email, result.panelId)
  return result
}
