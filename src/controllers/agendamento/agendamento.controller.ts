import { Request, Response } from 'express'
import Agendamento from '../../models/Agendamento'
import Usuario from '../../models/Usuario'
import Monitoria from '../../models/Monitoria'
import { diaDaSemana } from '../../utils/validacoes'
//import axios from 'axios'

export default class AgendamentoController {
    static async store(req: Request, res: Response){

        const { data, idMonitoria, obs } = req.body
        const idUsuario = req.headers.userId

        const hoje = new Date()

        if (!idUsuario || isNaN(Number(idUsuario))) return res.status(401).json({ error: 'Usuário não autenticado' })

        const usuario = await Usuario.findOneBy({id: Number(idUsuario)})

        if (usuario?.tipo == "Monitor") return res.status(403).json("Usuário não possui permissão de acesso")
        
        if(!idMonitoria || isNaN(Number(idMonitoria))) return res.status(401).json({ error: 'Monitoria inválida' })
				
        const monitoria = await Monitoria.findOneBy({ id: Number(idMonitoria) })
        if (!monitoria || !data ) return res.status(400).json({error: 'Monitoria e data devem ser preenchidas!'})

        const diaSemana = diaDaSemana(data)
        console.log(diaSemana)

        if (new Date(data) < hoje || monitoria.dia_semana !== diaSemana) return res.status(401).json("Data inválida")
        
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
        if (usuario !== null){
        if (usuario?.tipo == "Monitor") {
          //let alunos: number // quantidade de alunos naquele dia
          //let agendamentos: Agendamento[] = []

        //encontrar as monitorias deste monitor para dps poder retornar os agendamentos delas
          /*const monitorias = await Monitoria.find({
           where: { usuario: usuario },
           relations: ['agendamentos'] 
           })
          const agendamentos = monitorias.flatMap(monitoria => monitoria.agendamentos)*/
          console.log("Consulta: agendamentos - Monitor")
          const agendamentos = await Agendamento.createQueryBuilder('agendamento')
          .leftJoinAndSelect('agendamento.monitoria', 'monitoria')
          .leftJoinAndSelect('agendamento.usuario', 'usuario')
          .select([
            'agendamento.data',
            'monitoria.dia_semana',
            'monitoria.horario_inicio',
            'monitoria.horario_fim',
            'monitoria.local',
            'COUNT(agendamento.id) OVER (PARTITION BY agendamento.monitoriaId) AS alunoCount'
        ])
        .getRawMany()

        const resultado = agendamentos.map(agendamento => ({
          tipo: usuario.tipo,
          data: agendamento.data,
          dia_semana: agendamento.dia_semana,
          horario: `${agendamento.monitoria_horario_inicio} - ${agendamento.monitoria_horario_fim}`,
          local: agendamento.local,
          quantidadeAlunos: agendamento.alunoCount
        }))
               			
          return res.json(resultado)
        }

        else if (usuario?.tipo == "Aluno"){        
          
          /*const agendamentos = await Agendamento.find({ where: { 
            usuario: usuario, 
            data: MoreThan(new Date()) 
          },
            order: {data: 'ASC'},
            relations: ['monitorias']
        } )*/
            console.log("Consulta: agendamentos - Aluno")
            const agendamentos = await Agendamento.createQueryBuilder('agendamento')
            .leftJoinAndSelect('agendamento.monitoria', 'monitoria')
            .leftJoinAndSelect('monitoria.local', 'local')
            .leftJoinAndSelect('monitoria.materia', 'materia')
            .leftJoinAndSelect('agendamento.usuario', 'usuario')
            .where('usuario.id = :usuarioId', { idUsuario })
            .andWhere('agendamento.data >= CURRENT_DATE')
            .select([
              'agendamento.data',
              'monitoria.dia_semana',
              'monitoria.horario_inicio',
              'monitoria.horario_fim',
              'materia.nome AS materiaNome'
            ])
            .getRawMany()

          const resultado = agendamentos.map(agendamento => ({
            tipo: usuario.tipo,
            local: agendamento.local,
            materia: agendamento.materiaNome,
            data: agendamento.agendamento_data,
            dia_semana: agendamento.dia_semana,
            horario: `${agendamento.monitoria_horario_inicio} - ${agendamento.monitoria_horario_fim}`,
          }))

          return res.json(resultado)
        }
      
      }}


    }

