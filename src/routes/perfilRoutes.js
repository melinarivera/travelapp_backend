import express from 'express'
import { obtenerPerfil, guardarPerfil, eliminarCuenta } from '../controllers/perfilController.js'
import { verifySession } from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.get('/', verifySession, obtenerPerfil)
router.post('/', verifySession, upload.single('foto'), guardarPerfil)
router.delete('/cuenta', verifySession, eliminarCuenta)

export default router