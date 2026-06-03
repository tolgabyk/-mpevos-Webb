import fs from 'fs'
import crypto from 'crypto'
import { DB_FILE, ensureDataDirs } from './config.js'

const STATUSES = ['new', 'reviewing', 'invited', 'accepted', 'rejected']

function readAll() {
  ensureDataDirs()
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
}

function writeAll(data) {
  ensureDataDirs()
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

export function createApplication(data) {
  const applications = readAll()
  const application = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'new',
    adminNotes: '',
    ...data,
  }
  applications.unshift(application)
  writeAll(applications)
  console.log(`✅ Başvuru kaydedildi: ${application.fullName} (${application.id})`)
  return application
}

export function getApplications(filters = {}) {
  let applications = readAll()

  if (filters.status) {
    applications = applications.filter(a => a.status === filters.status)
  }
  if (filters.field) {
    applications = applications.filter(a => a.field === filters.field)
  }
  if (filters.university) {
    applications = applications.filter(a =>
      a.university?.toLowerCase().includes(filters.university.toLowerCase())
    )
  }
  if (filters.mandatoryInternship) {
    applications = applications.filter(a => a.mandatoryInternship === filters.mandatoryInternship)
  }

  return applications
}

export function getApplicationById(id) {
  return readAll().find(a => a.id === id) || null
}

export function updateApplication(id, updates) {
  const applications = readAll()
  const index = applications.findIndex(a => a.id === id)
  if (index === -1) return null

  if (updates.status && !STATUSES.includes(updates.status)) {
    throw new Error('Invalid status')
  }

  applications[index] = { ...applications[index], ...updates, updatedAt: new Date().toISOString() }
  writeAll(applications)
  return applications[index]
}

export { STATUSES }
