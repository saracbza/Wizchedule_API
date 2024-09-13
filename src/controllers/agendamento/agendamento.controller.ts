import { Request, Response } from 'express'
import Agendamento from '../../models/Agendamento'
import Usuario from '../../models/Usuario'
import Monitoria from '../../models/Monitoria'
import { diaDaSemana, TipoLocal } from '../../utils/validacoes'
import { MoreThanOrEqual } from 'typeorm'
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

        const data2 = new Date(data)
        const diaSemana = diaDaSemana(data2)
        console.log(diaSemana)

        if (new Date(data) < hoje || monitoria.dia_semana !== diaSemana) return res.status(401).json("Data inválida")
        
        if (usuario !== null)
        {
          const agendamentos = await Agendamento.find()
          agendamentos.forEach(a => {
          if (data == a.data && monitoria == a.monitoria && usuario == a.usuario) 
            return res.status(409).json("Usuário já está agendado para esta monitoria")
        }) 

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
        const hoje = new Date()

        if (!idUsuario || isNaN(Number(idUsuario))) res.status(401).json({ error: 'Usuário não autenticado' })
        const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
        if (usuario !== null){
        if (usuario?.tipo == "Monitor") {

        //encontrar as monitorias deste monitor para dps poder retornar os agendamentos delas
          const monitorias = await Monitoria.find({
            where: { usuario: usuario },
            relations: ['agendamentos', 'local'] 
           })

        //contagem de agendamentos associados a essa monitoria
           const contagemAlunos = new Map<number, Map<string, number>>()
           monitorias.forEach(monitoria => {
           
            if (!contagemAlunos.has(monitoria.id)) {
              contagemAlunos.set(monitoria.id, new Map<string, number>());
            }
          
            const dataContagem = contagemAlunos.get(monitoria.id)!;
            monitoria.agendamentos.forEach(agendamento => {
                const dataConv = agendamento.data.toISOString().split('T')[0]
                const count = dataContagem.get(dataConv) || 0
                dataContagem.set(dataConv, count + 1)
            })
        })
          console.log("Consulta: agendamentos - Monitor")
       
          const resultado = monitorias.flatMap(monitoria => 
            monitoria.agendamentos.map(agendamento => {
              const dataConv = agendamento.data.toISOString().split('T')[0]
              const quantidadeAluno = contagemAlunos.get(monitoria.id)?.get(dataConv) || 0
                
              return {
                local: monitoria.local 
                    ? (monitoria.local.numero ? `${monitoria.local.tipo} ${monitoria.local.numero}` : `${monitoria.local.tipo}`) 
                    : '',
                quantidadeAluno,
                data: agendamento.data,
                obs: agendamento.observacao,
                dia_semana: monitoria.dia_semana || '',
                horario: `${monitoria.horario_inicio} - ${monitoria.horario_fim}`,
            }
          })
        )
        const resultadoOrdenado = resultado.sort((a, b) => a.data.getTime() - b.data.getTime())
        return res.status(200).json(resultadoOrdenado)
        }

        else if (usuario?.tipo == "Aluno"){        

          console.log("Consulta: agendamentos - Aluno")
          const agendamentos = await Agendamento.find({ where: { 
            usuario: usuario, 
            data: MoreThanOrEqual(hoje) 
          },
            order: {data: 'ASC'},
            relations: ['monitoria']
        } )

      let local: string, materia: string
        async function dados(agendamento: Agendamento){
          const monitoria = await Monitoria.find({ where: {id: agendamento.monitoria.id}, relations: ['materia', 'local'] })
          console.log('Monitoria: ', monitoria)
          const localA = monitoria.map(m => (m.local.numero ? `${m.local.tipo} ${m.local.numero}` : `${m.local.tipo}`))
          const materiaA = monitoria.map(m => (m.materia.nome))

            local = localA[0]
            materia = materiaA[0]
          }

          const resultado = await Promise.all(agendamentos.map(async (agendamento) => {
            await dados(agendamento)
    
            return {
                id: agendamento.id,
                local,
                materia,
                data: agendamento.data,
                obs: agendamento.observacao,
                dia_semana: agendamento.monitoria?.dia_semana || '',
                horario: `${agendamento.monitoria?.horario_inicio} - ${agendamento.monitoria?.horario_fim}`,
            }
        }))
        return res.status(200).json(resultado)
        }
      
      }}
    }

