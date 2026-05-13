import express from 'express'
import { 
  agregarItinerario, 
  obtenerItinerario, 
  eliminarItinerario 
} from '../controllers/itinerarioController.js'
import { verifySession } from '../middleware/authMiddleware.js'

const router = express.Router()

// GET /api/itinerarios/viaje/:id
router.get('/viaje/:id', verifySession, obtenerItinerario)

// POST /api/itinerarios/viaje/:id
router.post('/viaje/:id', verifySession, agregarItinerario)

// DELETE /api/itinerarios/:itemId
router.delete('/:itemId', verifySession, eliminarItinerario)

export default router