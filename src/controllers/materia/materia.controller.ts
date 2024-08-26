import { Request, Response } from 'express'
import Materia from '../../models/Materia'

export default class MateriaController {

static async store (req: Request, res: Response){
  const { nome } = req.body 

  if(!nome) return res.status(400).json({error: "Nome obrigatório!"})
  
	const materia = new Materia()
	materia.nome = nome
	await materia.save() 
	        
	return res.json(materia) 
	 }
	 
static async show (req: Request, res: Response){
        const { idUsuario } = req.headers

        if (!idUsuario) return res.status(401).json({ error: 'Usuário não autenticado' })        

        const materia = await Materia.find()
        
        if (!materia) 
	        return res.status(404)

        return res.json(materia)    
    }	
}