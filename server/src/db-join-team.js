import fs from 'fs'
import crypto from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '..', 'data')
export const JOIN_TEAM_DB_FILE = path.join(DATA_DIR, 'join-team-applications.json')

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(JOIN_TEAM_DB_FILE)) fs.writeFileSync(JOIN_TEAM_DB_FILE, '[]', 'utf-8')
}

function readAll() {
  ensureDb()
  return JSON.parse(fs.readFileSync(JOIN_TEAM_DB_FILE, 'utf-8'))
}

function writeAll(data) {
  ensureDb()
  fs.writeFileSync(JOIN_TEAM_DB_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

export function createJoinTeamApplication(data) {
  const applications = readAll()
  const application = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'Yeni Başvuru',
    source: 'Web Sitesi',
    ...data,
  }
  applications.unshift(application)
  writeAll(applications)
  console.log(`✅ Ekip başvurusu kaydedildi: ${application.fullName} (${application.id})`)
  return application
}

export function getRecentJoinTeamByEmail(email, withinHours = 24) {
  const cutoff = Date.now() - withinHours * 60 * 60 * 1000
  return readAll().find(
    a => a.email?.toLowerCase() === email.toLowerCase() && new Date(a.createdAt).getTime() > cutoff,
  )
}
