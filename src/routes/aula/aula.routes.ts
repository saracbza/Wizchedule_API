import { Router } from 'express'
import AulaController from '../../controllers/aula/aula.controller'
import authMiddleware from '../../middlewares/auth.middleware'
//
const aulaRoutes = Router()

aulaRoutes.post('/', authMiddleware, AulaController.store)
aulaRoutes.post('/show', authMiddleware, AulaController.show)
aulaRoutes.delete('/:id', authMiddleware, AulaController.delete)

export default aulaRoutes