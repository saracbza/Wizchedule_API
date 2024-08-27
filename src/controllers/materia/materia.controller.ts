import { Request, Response } from 'express'
import Materia from '../../models/Materia'
import Usuario from '../../models/Usuario'

export default class MateriaController {

static async store (req: Request, res: Response){
  const idUsuario = req.headers.userId
  const { nome } = req.body 

  if (!idUsuario || isNaN(Number(idUsuario))) res.status(401).json({ error: 'Usuário não autenticado' })

  const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
  if (usuario?.tipo == "Aluno" || !usuario) res.status(403).json("Usuário não possui permissão de acesso")

  if(!nome) return res.status(400).json({error: "Nome obrigatório!"})
  
	const materia = new Materia()
	materia.nome = nome
	await materia.save() 
	        
	return res.json(materia) 
	 }
	 
static async show (req: Request, res: Response){
        const  idUsuario = req.headers.userId
        if (!idUsuario || isNaN(Number(idUsuario))) return res.status(401).json({ error: 'Usuário não autenticado' })    
        
        const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
        if (usuario?.tipo == "Aluno" || !usuario) res.status(403).json("Usuário não possui permissão de acesso")    

        const materia = await Materia.find()
        
        if (!materia) 
	      return res.status(404)

        return res.json(materia) 
    }	
}