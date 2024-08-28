import { Request, Response } from 'express'
import Agendamento from '../../models/Agendamento'
import Usuario from '../../models/Usuario'
import Monitoria from '../../models/Monitoria'
import { MoreThan } from 'typeorm'
import { diaDaSemana } from '../../utils/validacoes'


export default class AgendamentoController {
    static async store(req: Request, res: Response){
        const { data, idMonitoria, obs } = req.body
        const idUsuario = req.headers.userId

        const hoje = new Date()

        if (!idUsuario || isNaN(Number(idUsuario))) res.status(401).json({ error: 'Usuário não autenticado' })

        const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
        if (usuario?.tipo == "Monitor") res.status(403).json("Usuário não possui permissão de acesso")
        
        if(!idMonitoria || isNaN(Number(idMonitoria))) return res.status(401).json({ error: 'Monitoria inválida' })
				const monitoria = await Monitoria.findOneBy({ id: Number(idMonitoria) })
			
        if (!monitoria || !data )
          return res.status(400).json({error: 'Monitoria e data devem ser preenchidas!'})

        const diaSemana = diaDaSemana(data)

        if (data < hoje || monitoria.dia_semana !== diaSemana) res.json("Data inválida")
        if (usuario !== null)
        {
        const agendamento = new Agendamento()
        agendamento.data = data
        agendamento.monitoria = monitoria
        agendamento.observacao = obs
        agendamento.usuario = usuario

        await agendamento.save()
        
        return res.status(201).json(agendamento)
        }
        return res.json('Erro com usuário')
    }
    
    /*static async dataAgendamento (req: Request, res: Response){
      const idUsuario = req.headers.userId

      if (!idUsuario) res.status(401).json({ error: 'Usuário não autenticado' })
        const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
        if (usuario?.tipo == "Aluno") res.status(403).json("Usuário não possui permissão de acesso")
      
      if (usuario !== null)
      {  
        const agendamentos = await Agendamento.find({ where: { 
          usuario: usuario, 
          data: MoreThan(new Date()) 
        },
          order: {data: 'ASC'}
      })
      const datas = agendamentos.map(agendamento => agendamento.data)
      return res.json(datas)
      }
      else res.json('Erro com usuário')
    }*/

    static async show (req: Request, res: Response){
		    const idUsuario = req.headers.userId
		   
        if (!idUsuario || isNaN(Number(idUsuario))) res.status(401).json({ error: 'Usuário não autenticado' })
        const usuario = await Usuario.findOneBy({id: Number(idUsuario)})

        if (usuario?.tipo == "Monitor") {
          //let alunos: number // quantidade de alunos naquele dia
          let agendamentos: Agendamento[] = []

          if (usuario !== null) {
        //encontrar as monitorias deste monitor para dps poder retornar os agendamentos delas
          const monitorias = await Monitoria.find({
           where: { usuario: usuario },
           relations: ['agendamentos'] 
           })
          agendamentos = monitorias.flatMap(monitoria => monitoria.agendamentos)                      			
          return res.json({todos: agendamentos})
      }
        }

        else if (usuario?.tipo == "Aluno"){        
          if (usuario !== null) {
          const agendamentos = await Agendamento.find({ where: { 
            usuario: usuario, 
            data: MoreThan(new Date()) 
          },
            order: {data: 'ASC'}
        })
        return res.json(agendamentos)
      }}

        else res.json('Usuário não existe')
    }

}