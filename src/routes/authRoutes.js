import express from 'express'
import { login } from '../controllers/authController.js' 
import { register } from '../controllers/register/registerController.js'

const router = express.Router()

router.post('/login', login)
router.post('/register', register) // Adiciona a rota de registro

export default router