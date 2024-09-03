import { Request, Response } from 'express'
import Usuario from '../../models/Usuario'
import Local from '../../models/Local'

export default class LocalController {

static async store (req: Request, res: Response){
  const  idUsuario = req.headers.userId
  const { numero, tipo } = req.body 
    
  if (!idUsuario || isNaN(Number(idUsuario))) return res.status(401).json({ error: 'Usuário não autenticado' })

  const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
  if (usuario?.tipo == "Aluno") return res.status(403).json("Usuário não possui permissão de acesso")

  if(!tipo) return res.status(400).json({error: "Tipo é obrigatório!"})
  if (tipo == "Sala" || tipo == "Laboratório")
    if (!numero) return res.status(400).json("Sala e laboratório devem ter número")

  
	const local = new Local()
	local.tipo = tipo
    local.numero = numero ?? ""
	await local.save() 
	        
	return res.json(local) 
	 }
	 
static async show (req: Request, res: Response){
        const idUsuario = req.headers.userId

        if (!idUsuario) return res.status(401).json({ error: 'Usuário não autenticado' })    
        
        const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
        if (usuario?.tipo == "Aluno" || !usuario) return res.status(403).json("Usuário não possui permissão de acesso")    

        const local = await Local.find()
        
        if (!local) 
	      return res.status(404)

        return res.json(local) 
    }	
}