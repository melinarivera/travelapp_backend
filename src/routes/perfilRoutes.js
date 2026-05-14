import express from 'express'
import { obtenerPerfil, guardarPerfil } from '../controllers/perfilController.js'
import { verifySession } from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.get('/', verifySession, obtenerPerfil)
router.post('/', verifySession, upload.single('foto'), guardarPerfil)

export default router