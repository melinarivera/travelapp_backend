import express from 'express'
import { crearViaje, obtenerViajes } from '../controllers/viajesController.js'
import { verifySession } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', verifySession, obtenerViajes)
router.post('/', verifySession, crearViaje)

export default router