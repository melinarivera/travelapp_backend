import express from 'express'
import {
  obtenerChecklists,
  crearChecklist,
  eliminarChecklist,
  agregarItem,
  toggleItem,
  eliminarItem
} from '../controllers/checklistController.js'
import { verifySession } from '../middleware/authMiddleware.js'

const router = express.Router({ mergeParams: true })

router.get('/', verifySession, obtenerChecklists)
router.post('/', verifySession, crearChecklist)
router.delete('/:id', verifySession, eliminarChecklist)
router.post('/:checklistId/items', verifySession, agregarItem)
router.patch('/items/:itemId', verifySession, toggleItem)
router.delete('/items/:itemId', verifySession, eliminarItem)

export default router