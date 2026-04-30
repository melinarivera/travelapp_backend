import express from 'express'
import { login } from '../controllers/authController.js'
import { verifySession } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/login', login)
router.get('/me', verifySession, (req, res) => {
  res.status(200).json({
    message: 'Sesión válida',
    user: req.user
  })
})

export default router