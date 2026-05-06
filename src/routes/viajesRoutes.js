import express from 'express'
import { crearViaje, obtenerViajes } from '../controllers/viajesController.js'
import { verifySession } from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.get('/', verifySession, obtenerViajes)
router.post('/', verifySession, upload.single('imagen'), crearViaje)

export default router