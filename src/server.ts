import express from 'express'
import dotenv from 'dotenv'
import { initializeDatabase, dataBase } from './database/ormconfig'
import seed from './database/seed'
import routes from './routes'
//import cors from 'cors'
//
dotenv.config()
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(routes)
/*app.use(cors({
  origin: '*'
}))*/

const startServer = async () => {
  try {
    await initializeDatabase()
    
    await seed()
    console.log('Seed executado com sucesso!')

    app.listen(port, () => {
      console.log(`Servidor executando na porta ${port}`)
    })
  } catch (error) {
    console.error('Erro ao inicializar a aplicação:', error)
  }
}

startServer()
