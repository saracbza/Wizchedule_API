import { Request, Response } from 'express'
import Monitoria from '../../models/Monitoria'
import Materia from '../../models/Materia'
import { diaDaSemana } from '../../utils/Utils'
import Usuario from '../../models/Usuario'

export default class MonitoriaController{
    static async store (req: Request, res: Response){
        const { dia_semana, horario_inicio, horario_fim, local, idMateria, idMonitor, adm } = req.body 

				if (!adm) res.status(403).json('Não possui permissão de acesso')
				
        if(!dia_semana|| !horario_inicio || !horario_fim || !local || !idMateria || !idMonitor 
            || isNaN(Number(idMateria)) || isNaN(Number(idMonitor))) 
        return res.status(400).json({error: "Todos os dados são obrigatórios!"})

        const materia = await Materia.findOneBy({ id: Number(idMateria)})
        const monitor = await Usuario.findOneBy({ id: Number(idMonitor)})

        if (!monitor || !materia) return res.status(400).json({ error: 'Informações inválidas' })      
        if (monitor.curso !== "Monitoria") res.json('Id de usuário não corresponde à um monitor')       
		
	       const monitoria = new Monitoria()
	       monitoria.dia_semana = dia_semana
	       monitoria.horario_inicio = horario_inicio
         monitoria.horario_fim = horario_fim
	       monitoria.local = local
	       monitoria.materia = materia
	       monitoria.usuario = monitor 
	       await monitoria.save() 
	        
	       return res.json({
          dia_semana: monitoria.dia_semana,
          horario_inicio: monitoria.horario_inicio,
          horario_fim: monitoria.horario_fim,
          local: monitoria.local,
          materia: monitoria.materia.nome,
          monitor: monitoria.usuario.nome
         }) 
	      }

//mostra todas as monitorias do dia da semana da data escolhida
	static async show (req: Request, res: Response){
        const { data } = req.body
        
				const dia_semana = diaDaSemana(new Date(data))
				
        const monitorias = await Monitoria.find({
          relations: ["materia"],
          where: { dia_semana: dia_semana }
         })

         const materiasSet = monitorias.map(monitoria => monitoria.materia)
         const materias = Array.from(materiasSet)

        return res.json(materias)
     }        
    }