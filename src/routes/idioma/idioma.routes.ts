import { Router } from 'express'
import IdiomaController from '../../controllers/idioma/idioma.controller'
import authMiddleware from '../../middlewares/auth.middleware'
//
const idiomaRoutes = Router()

idiomaRoutes.post('/', authMiddleware, IdiomaController.store)
idiomaRoutes.get('/', authMiddleware, IdiomaController.show)

export default idiomaRoutes