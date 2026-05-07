import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './src/routes/authRoutes.js'
import viajesRoutes from './src/routes/viajesRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5175', 'http://localhost:5176']
}))

app.use(express.json())

app.get('/', (req, res) => {
  res.send('TravelApp API funcionando')
})

app.use('/api/auth', authRoutes)

app.use('/api/viajes', viajesRoutes)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})