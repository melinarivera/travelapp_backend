import express from 'express'
import { subirDocumento, obtenerDocumentos, eliminarDocumento } from '../controllers/documentosController.js'
import { verifySession } from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router({ mergeParams: true })

router.get('/', verifySession, obtenerDocumentos)
router.post('/', verifySession, upload.single('archivo'), subirDocumento)
router.delete('/:id', verifySession, eliminarDocumento)

export default router