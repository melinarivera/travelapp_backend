import express from 'express'
import { obtenerLinks, crearLink, eliminarLink } from '../controllers/linksController.js'
import { verifySession } from '../middleware/authMiddleware.js'
 
const router = express.Router({ mergeParams: true })
 
router.get('/', verifySession, obtenerLinks)
router.post('/', verifySession, crearLink)
router.delete('/:id', verifySession, eliminarLink)
 
export default router