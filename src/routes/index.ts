import { Router } from 'express'
import agendamentoRoutes from './agendamento/agendamento.routes'
import idiomaRoutes from './idioma/idioma.routes'
import aulaRoutes from './aula/aula.routes'
import authRoutes from './auth/auth.routes'
import salaRoutes from './sala/sala.routes'
//
const routes = Router()

routes.use('/agendamento', agendamentoRoutes)
routes.use('/idioma', idiomaRoutes)
routes.use('/aula', aulaRoutes)
routes.use('/sala', salaRoutes)
routes.use('/auth', authRoutes)

export default routes