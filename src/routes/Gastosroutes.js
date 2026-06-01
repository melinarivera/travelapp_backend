import express from 'express'
import { obtenerGastos, crearGasto, eliminarGasto, obtenerIntegrantes } from '../controllers/gastosController.js'
import { verifySession } from '../middleware/authMiddleware.js'

const router = express.Router({ mergeParams: true })

router.get('/integrantes', verifySession, obtenerIntegrantes)
router.get('/', verifySession, obtenerGastos)
router.post('/', verifySession, crearGasto)
router.delete('/:id', verifySession, eliminarGasto)

export default router