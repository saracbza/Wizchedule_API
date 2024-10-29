import { Request, Response } from 'express'
import Idioma from '../../models/Idioma'
import Usuario from '../../models/Usuario'

export default class IdiomaController {

static async store (req: Request, res: Response){
  const idUsuario = req.headers.userId
  const { nome } = req.body 

  if (!idUsuario || isNaN(Number(idUsuario))) res.status(401).json({ error: 'Usuário não autenticado' })

  const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
  if (usuario?.tipo == "Aluno" || !usuario) res.status(403).json("Usuário não possui permissão de acesso!")

  if(!nome) return res.status(400).json({error: "Nome obrigatório!"})
  
	const idioma = new Idioma()
	idioma.nome = nome
	await idioma.save() 
	        
	return res.json(idioma) 
	 }
	 
static async show (req: Request, res: Response){
  const  idUsuario = req.headers.userId
  if (!idUsuario || isNaN(Number(idUsuario))) return res.status(401).json({ error: 'Usuário não autenticado' })    
  
  const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
  if (!usuario) res.json("Usuário não encontrado")    

  const idioma = await Idioma.find()
  
  if (!idioma) 
  return res.status(404)

  return res.json(idioma) 
}	

static async delete (req: Request, res: Response) {
  const { id } = req.params
  const idUsuario = req.headers.userId

  if(!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'O idioma deve ser informado para exclusão' })
  }

  if (!idUsuario || isNaN(Number(idUsuario))) return res.status(401).json({ error: 'Usuário sem autenticação' })
  const usuario = await Usuario.findOneBy({id: Number(id)})
  
  if (!usuario) return res.status(401).json({ error: 'Usuário não autenticado' })
  if (usuario?.tipo == "Aluno") return res.status(403).json("Usuário não possui permissão de acesso")
  const idioma = await Idioma.findOne({ where: {id: Number(id)} })

  if (!idioma) return res.status(404).json({ error: 'Idioma não encontrado' })

  await idioma.remove()
  return res.status(204).json('Idioma excluído!')
  }
}