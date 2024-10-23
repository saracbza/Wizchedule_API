import { Router } from 'express'
import AuthController from '../../controllers/auth/auth.controller'
import authMiddleware from '../../middlewares/auth.middleware'

const authRoutes = Router()

authRoutes.post('/register', AuthController.store)
authRoutes.post('/login', AuthController.login)
//authRoutes.post('/refresh', AuthController.refresh)
authRoutes.post('/logout', authMiddleware, AuthController.logout)
authRoutes.post('/mudarFoto', authMiddleware, AuthController.mudarFoto)

export default authRoutes