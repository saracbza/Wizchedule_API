import { Request, Response } from 'express'
import Usuario from '../../models/Usuario'
import Sala from '../../models/Sala'

export default class SalaController {

static async store (req: Request, res: Response){
  const  idUsuario = req.headers.userId
  const { numero } = req.body 
    
  if (!idUsuario || isNaN(Number(idUsuario))) return res.status(401).json({ error: 'Usuário não autenticado' })

  const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
  if (usuario?.tipo == "Aluno") return res.status(403).json("Usuário não possui permissão de acesso!")
  
	const sala = new Sala()
    sala.numero = numero ?? ""
	await sala.save() 
	        
	return res.json(sala) 
	 }
	 
static async show (req: Request, res: Response){
        const idUsuario = req.headers.userId

        if (!idUsuario) return res.status(401).json({ error: 'Usuário não autenticado' })    
        
        const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
        if (usuario?.tipo == "Aluno" || !usuario) return res.status(403).json("Usuário não possui permissão de acesso")    

        const sala = await Sala.find()
        
        if (!sala) 
	      return res.status(404)
        const salas = sala.map(s => `Sala ${s.numero}`)
        return res.status(200).json(salas)
    }	
    static async delete (req: Request, res: Response) {
      const { id } = req.params
      const idUsuario = req.headers.userId
    
      if(!id || isNaN(Number(id))) {
        return res.status(400).json({ error: 'A sala deve ser informada para exclusão' })
      }
    
      if (!idUsuario || isNaN(Number(idUsuario))) return res.status(401).json({ error: 'Usuário sem autenticação' })
      const usuario = await Usuario.findOneBy({id: Number(id)})
      
      if (!usuario) return res.status(401).json({ error: 'Usuário não autenticado' })
      if (usuario?.tipo == "Aluno") return res.status(403).json("Usuário não possui permissão de acesso")
      const idioma = await Sala.findOne({ where: {id: Number(id)} })
    
      if (!idioma) return res.status(404).json({ error: 'Sala não encontrada' })
    
      await idioma.remove()
      return res.status(204).json('Sala excluída!')
      }
}