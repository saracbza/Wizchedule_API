import { Router } from 'express'
import authMiddleware from '../../middlewares/auth.middleware'
import SalaController from '../../controllers/sala/sala.controller'
//
const salaRoutes = Router()

salaRoutes.post('/', authMiddleware, SalaController.store)
salaRoutes.get('/', authMiddleware, SalaController.show)
salaRoutes.delete('/', authMiddleware, SalaController.delete)

export default salaRoutes