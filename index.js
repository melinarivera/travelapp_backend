import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './src/routes/authRoutes.js'
import viajesRoutes from './src/routes/viajesRoutes.js'
import integrantesRoutes from './src/routes/integrantesRoutes.js'
import documentosRoutes from './src/routes/documentosRoutes.js'
import itinerarioRoutes from './src/routes/itinerarioRoutes.js'
import poiRoutes from './src/routes/poiRoutes.js'
import perfilRoutes from './src/routes/perfilRoutes.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176']
}))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('TravelApp API funcionando')
})

app.use('/api/perfil', perfilRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/viajes/:viajeId/integrantes', integrantesRoutes)
app.use('/api/viajes/:viajeId/documentos', documentosRoutes)
app.use('/api/viajes', viajesRoutes)
app.use('/api/itinerarios', itinerarioRoutes)
app.use('/api/poi', poiRoutes)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})