import { Router } from 'express'
import MonitoriaController from '../../controllers/monitoria/monitoria.controller'
import authMiddleware from '../../middlewares/auth.middleware'

const monitoriaRoutes = Router()

monitoriaRoutes.post('/', authMiddleware, MonitoriaController.store)
monitoriaRoutes.get('/', authMiddleware, MonitoriaController.show)

export default monitoriaRoutes