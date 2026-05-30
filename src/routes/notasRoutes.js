import express from 'express'
import {
  obtenerNotas,
  crearNota,
  actualizarNota,
  eliminarNota
} from '../controllers/notasController.js'
import { verifySession } from '../middleware/authMiddleware.js'

const router = express.Router({ mergeParams: true })

router.get('/', verifySession, obtenerNotas)
router.post('/', verifySession, crearNota)
router.patch('/:id', verifySession, actualizarNota)
router.delete('/:id', verifySession, eliminarNota)

export default router