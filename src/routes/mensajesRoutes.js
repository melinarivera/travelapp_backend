import express from 'express'
import { obtenerMensajes, enviarMensaje, eliminarMensaje } from '../controllers/mensajesController.js'
import { verifySession } from '../middleware/authMiddleware.js'

const router = express.Router({ mergeParams: true })

router.get('/', verifySession, obtenerMensajes)
router.post('/', verifySession, enviarMensaje)
router.delete('/:id', verifySession, eliminarMensaje)

export default router