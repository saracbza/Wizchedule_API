import { Request, Response } from 'express'
import Monitoria from '../../models/Monitoria'
import Materia from '../../models/Materia'
import { diaDaSemana } from '../../utils/validacoes'
import Usuario from '../../models/Usuario'
import Local from '../../models/Local'

export default class MonitoriaController{
    static async store (req: Request, res: Response){
        const idUsuario = req.headers.userId
        const { dia_semana, horario_inicio, horario_fim, idLocal, idMateria } = req.body 
        
        if (!idUsuario || isNaN(Number(idUsuario))) res.status(401).json({ error: 'Usuário não autenticado' })

        const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
        if (usuario?.tipo == "Aluno") res.status(403).json("Usuário não possui permissão de acesso")

        if(!idLocal || isNaN(Number(idLocal))) res.json("Local é obrigatório")
        const local = await Local.findOneBy({id: Number(idLocal)})
        if (!local) res.json("Local informado não existe")

        if(!idMateria || isNaN(Number(idMateria))) res.json("Local é obrigatório")
        const materia = await Materia.findOneBy({id: Number(idMateria)})
        if (!materia) res.json("Materia informada não existe")

        if(!dia_semana|| !horario_inicio || !horario_fim ) 
        res.status(400).json({error: "Todos os dados são obrigatórios!"})

        if (local !== null && materia !== null && usuario !== null){
	       const monitoria = new Monitoria()
	       monitoria.dia_semana = dia_semana
	       monitoria.horario_inicio = horario_inicio
         monitoria.horario_fim = horario_fim
	       monitoria.local = local
	       monitoria.materia = materia
	       monitoria.usuario = usuario
	       await monitoria.save() 
	      
        return res.status(201).json({
          materia: monitoria.materia.nome,
          dia_semana: monitoria.dia_semana,
          horario_inicio: monitoria.horario_inicio,
          horario_fim: monitoria.horario_fim,
          local: monitoria.local,
          monitor: monitoria.usuario.nome
        })}

	      }

//mostra todas as monitorias do dia da semana da data escolhida
	static async show (req: Request, res: Response){
        const { data } = req.body
        const idUsuario = req.headers.userId
        
        if (!idUsuario || isNaN(Number(idUsuario))) res.status(401).json({ error: 'Usuário não autenticado' })

        const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
        if (!usuario) res.json("Usuário não existe")

				const dia_semana = diaDaSemana(new Date(data))
				
        const monitorias = await Monitoria.find({
          relations: ['materia', 'local'],
          where: { dia_semana: dia_semana }
         })

         const resultado = monitorias.map (monitoria => {
            return {
              id: monitoria.id,
              materia: monitoria.materia.nome,
              dia_semana: monitoria.dia_semana,
              horario: `${monitoria.horario_inicio} - ${monitoria.horario_fim}`,
              local: monitoria.local ?
              (monitoria.local.numero ? `${monitoria.local.tipo} ${monitoria.local.numero}` : `${monitoria.local.tipo}`) 
              : '',
            }
         })

         return res.status(200).json(resultado)
     }        
    }