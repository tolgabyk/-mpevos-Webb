import crypto from 'crypto'

const sessions = new Map()

export function createSession() {
  const token = crypto.randomBytes(32).toString('hex')
  sessions.set(token, { createdAt: Date.now() })
  return token
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Yetkilendirme gerekli' })
  }

  const token = header.slice(7)
  if (!sessions.has(token)) {
    return res.status(401).json({ error: 'Geçersiz oturum' })
  }

  next()
}

export function verifyPassword(password) {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) return false
  return password === adminPassword
}
