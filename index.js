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
import checklistRoutes from './src/routes/checklistRoutes.js'
import notasRoutes from './src/routes/notasRoutes.js'
import linksRoutes from './src/routes/linksRoutes.js'
import gastosRoutes from './src/routes/Gastosroutes.js'
import mensajesRoutes from './src/routes/mensajesRoutes.js'


dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'https://travelapp-frontend-pi.vercel.app']
}))

app.use(express.json())

app.get('/', (req, res) => {
  res.send('TravelApp API funcionando')
})

app.use('/api/perfil', perfilRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/viajes/:viajeId/integrantes', integrantesRoutes)
app.use('/api/viajes/:viajeId/documentos', documentosRoutes)
app.use('/api/viajes/:viajeId/checklists', checklistRoutes)
app.use('/api/viajes/:viajeId/notas', notasRoutes)
app.use('/api/viajes/:viajeId/mensajes', mensajesRoutes)
app.use('/api/viajes', viajesRoutes)
app.use('/api/itinerarios', itinerarioRoutes)
app.use('/api/poi', poiRoutes)
app.use('/api/viajes/:viajeId/links', linksRoutes)
app.use('/api/viajes/:viajeId/gastos', gastosRoutes)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

