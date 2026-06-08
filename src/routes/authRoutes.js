import express from 'express'
import { login, registro, recuperarPassword } from '../controllers/authController.js'
import { verifySession } from '../middleware/authMiddleware.js'


const router = express.Router()

router.post('/login', login)
router.post('/registro', registro)
router.get('/me', verifySession, (req, res) => {
  res.status(200).json({
    message: 'Sesión válida',
    user: req.user
  })
})
router.post('/recuperar-password', recuperarPassword)
export default router