import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import contactRoutes from './routes/contact.js'
import internshipRoutes from './routes/internship.js'
import adminRoutes from './routes/admin.js'
import joinTeamRoutes from './routes/join-team.js'
import { ensureDataDirs, logConfigStatus } from './config.js'

dotenv.config()
ensureDataDirs()
logConfigStatus()

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/contact', contactRoutes)
app.use('/api/internship', internshipRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/join-team', joinTeamRoutes)

// Base
app.get('/', (req, res) => {
  res.json({ message: 'IMPEVOS API is running.' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
