import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import contactRoutes from './routes/contact.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/contact', contactRoutes)

// Base
app.get('/', (req, res) => {
  res.json({ message: 'IMPEVOS API is running.' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
