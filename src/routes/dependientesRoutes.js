import express from 'express'
import { obtenerDependientes, crearDependiente, eliminarDependiente } from '../controllers/dependientesController.js'
import { verifySession } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', verifySession, obtenerDependientes)
router.post('/', verifySession, crearDependiente)
router.delete('/:id', verifySession, eliminarDependiente)

export default router