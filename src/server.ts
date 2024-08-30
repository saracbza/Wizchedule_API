import express from 'express'
import dotenv from 'dotenv'
import dataBase from './database/ormconfig'
import seed from './database/seed'

import routes from './routes'

dotenv.config()
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(routes)

app.listen(port, async () => {
  console.log(`Servidor executando na porta ${port}`)
  
  if (dataBase.isInitialized){
    console.log('Banco de dados inicializado!')
    await seed()
    console.log('Seed executado com sucesso!')
  }
  else console.log('Banco de dados não inicializado!')
})
