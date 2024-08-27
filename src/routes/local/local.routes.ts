import { Router } from 'express'
import authMiddleware from '../../middlewares/auth.middleware'
import LocalController from '../../controllers/local/local.controller'

const localRoutes = Router()

localRoutes.post('/', authMiddleware, LocalController.store)
localRoutes.get('/', authMiddleware, LocalController.show)

export default localRoutes