import express from 'express'
import { obtenerIntegrantes, agregarIntegrante, eliminarIntegrante } from '../controllers/integrantesController.js'
import { verifySession } from '../middleware/authMiddleware.js'

const router = express.Router({ mergeParams: true })

router.get('/', verifySession, obtenerIntegrantes)
router.post('/', verifySession, agregarIntegrante)
router.delete('/:integranteId', verifySession, eliminarIntegrante)

export default router