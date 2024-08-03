import { Request, Response } from 'express'
import Materia from '../../models/Materia'

export default class MateriaController {

static async store (req: Request, res: Response){
  const { nome, adm } = req.body 
  //adm é o responsavel pelo cadastro de monitores, materias e monitorias (so ele tera acesso as telas de cadastro)
        
	if (!adm) res.status(403).json('Não possui permissão de acesso')

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