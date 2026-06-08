import express from 'express'
import { obtenerGastos, crearGasto, eliminarGasto, obtenerIntegrantes } from '../controllers/gastosController.js'
import { verifySession } from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'
 
const router = express.Router({ mergeParams: true })
 
router.get('/integrantes', verifySession, obtenerIntegrantes)
router.get('/', verifySession, obtenerGastos)
router.post('/', verifySession, upload.single('comprobante'), crearGasto)
router.delete('/:id', verifySession, eliminarGasto)
 
export default router