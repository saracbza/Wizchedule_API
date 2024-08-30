import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const dataBase = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE || path.join(__dirname, '../database/database.sqlite'),
  entities: [
    path.join(__dirname, '../models/*.ts')
  ],
  logging: true,
  synchronize: true,
})

const initializeDatabase = async () => {
  try {
    await dataBase.initialize()
    console.log('Banco de dados inicializado com sucesso!')
  } catch (e) {
    console.error('Erro ao inicializar o banco de dados:', e)
    throw e
  }
}

export { dataBase, initializeDatabase }