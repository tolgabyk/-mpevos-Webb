import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const DATA_DIR = path.join(__dirname, '..', 'data')
export const DB_FILE = path.join(DATA_DIR, 'applications.json')
export const CV_DIR = path.join(DATA_DIR, 'cvs')
const OLD_CV_DIR = path.join(__dirname, 'uploads', 'cvs')

export function ensureDataDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(CV_DIR)) fs.mkdirSync(CV_DIR, { recursive: true })
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '[]', 'utf-8')

  if (fs.existsSync(OLD_CV_DIR)) {
    for (const file of fs.readdirSync(OLD_CV_DIR)) {
      const src = path.join(OLD_CV_DIR, file)
      const dest = path.join(CV_DIR, file)
      if (!fs.existsSync(dest)) fs.copyFileSync(src, dest)
    }
  }
}

export function logConfigStatus() {
  const issues = []

  if (!process.env.ADMIN_PASSWORD) {
    issues.push('ADMIN_PASSWORD tanımlı değil → /admin paneline giriş yapılamaz')
  }
  if (!process.env.SMTP_PASS || process.env.SMTP_PASS.includes('BURAYA')) {
    issues.push('SMTP_PASS geçersiz → e-posta gönderilemez (Gmail Uygulama Şifresi gerekli)')
  }
  if (!process.env.INTERNSHIP_EMAIL && !process.env.JOIN_TEAM_EMAIL) {
    issues.push('INTERNSHIP_EMAIL / JOIN_TEAM_EMAIL tanımlı değil → varsayılan kariyer@impevos.com.tr kullanılacak')
  }
  if (!process.env.DASHBOARD_API_KEY && !process.env.INTERNSHIP_APPLICATIONS_WEBHOOK_SECRET) {
    issues.push('DASHBOARD_API_KEY tanımlı değil → CRM paneli kapalı, e-postalar doğrudan kariyer@impevos.com.tr adresine iletilecek')
  }

  console.log('')
  console.log('📋 İmpevos Başvuru Sistemi')
  console.log(`   Veritabanı : ${DB_FILE}`)
  console.log(`   CV klasörü : ${CV_DIR}`)
  console.log(`   E-posta    : ${process.env.JOIN_TEAM_EMAIL || process.env.INTERNSHIP_EMAIL || 'kariyer@impevos.com.tr'}`)
  console.log(`   Admin panel: http://localhost:5173/admin/login`)

  if (issues.length) {
    console.log('')
    console.log('⚠️  Yapılandırma uyarıları:')
    issues.forEach(msg => console.log(`   • ${msg}`))
  }
  console.log('')
}
