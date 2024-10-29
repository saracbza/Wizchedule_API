import { Request, Response } from 'express'
import Aula from '../../models/Aula'
import Idioma from '../../models/Idioma'
import { diaDaSemana } from '../../utils/validacoes'
import Usuario from '../../models/Usuario'
import Sala from '../../models/Sala'

export default class AulaController{
    static async store (req: Request, res: Response){
        const idUsuario = req.headers.userId
        const { dia_semana, horario_inicio, horario_fim, idSala, idIdioma } = req.body 
        
        if (!idUsuario || isNaN(Number(idUsuario))) res.status(401).json({ error: 'Usuário não autenticado' })

        const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
        if (usuario?.tipo == "Aluno") res.status(403).json("Usuário não possui permissão de acesso")

        if(!idSala || isNaN(Number(idSala))) res.json("Sala é obrigatório")
        const sala = await Sala.findOneBy({id: Number(idSala)})
        if (!sala) res.json("Sala informado não existe")

        if(!idIdioma || isNaN(Number(idIdioma))) res.json("Idioma é obrigatório")
        const idioma = await Idioma.findOneBy({id: Number(idIdioma)})
        if (!idioma) res.json("Idioma informada não existe")

        if(!dia_semana|| !horario_inicio || !horario_fim ) 
        res.status(400).json({error: "Todos os dados são obrigatórios!"})

        if (sala !== null && idioma !== null && usuario !== null){
	       const aula = new Aula()
	       aula.dia_semana = dia_semana
	       aula.horario_inicio = horario_inicio
         aula.horario_fim = horario_fim
	       aula.sala = sala
	       aula.idioma = idioma
	       aula.usuario = usuario
	       await aula.save() 
	      
        return res.status(201).json({
          idioma: aula.idioma.nome,
          dia_semana: aula.dia_semana,
          horario_inicio: aula.horario_inicio,
          horario_fim: aula.horario_fim,
          sala: aula.sala,
          professor: aula.usuario.nome
        })}

	      }

	static async show (req: Request, res: Response){
        const { data } = req.body
        const idUsuario = req.headers.userId
        
        if (!idUsuario || isNaN(Number(idUsuario))) res.status(401).json({ error: 'Usuário não autenticado' })

        const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
        if (!usuario) res.json("Usuário não existe")

				const dia_semana = diaDaSemana(new Date(data))
				
        const aulas = await Aula.find({
          relations: ['idioma', 'sala'],
          where: { dia_semana: dia_semana }
         })

         const resultado = aulas.map (aula => {
            return {
              id: aula.id,
              idioma: aula.idioma.nome,
              dia_semana: aula.dia_semana,
              horario: `${aula.horario_inicio} - ${aula.horario_fim}`,
              sala: `Sala ${aula.sala.numero}`
            }
         })

         return res.status(200).json(resultado)
     }
     
     static async delete (req: Request, res: Response) {
      const { id } = req.params
      const idUsuario = req.headers.userId
  
      if(!id || isNaN(Number(id))) {
        return res.status(400).json({ error: 'A aula deve ser informada para exclusão' })
      }
  
      if (!idUsuario || isNaN(Number(idUsuario))) return res.status(401).json({ error: 'Usuário sem autenticação' })
      const usuario = await Usuario.findOneBy({id: Number(id)})
      
      if (!usuario) return res.status(401).json({ error: 'Usuário não autenticado' })
      if (usuario?.tipo == "Aluno") return res.status(403).json("Usuário não possui permissão de acesso")
      const aula = await Aula.findOne({ where: {id: Number(id), usuario: usuario }})
  
      if (!aula) return res.status(404).json({ error: 'Aula não encontrada' })

      await aula.remove()
      return res.status(204).json('Aula excluída!')
      }
    }