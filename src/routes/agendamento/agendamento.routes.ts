import { Router } from 'express'
import AgendamentoController from '../../controllers/agendamento/agendamento.controller'
import authMiddleware from '../../middlewares/auth.middleware'
//
const agendamentoRoutes = Router()

agendamentoRoutes.post('/', authMiddleware, AgendamentoController.store)
agendamentoRoutes.get('/', authMiddleware, AgendamentoController.show)

export default agendamentoRoutes