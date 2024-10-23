import { Request, Response } from 'express'
import Agendamento from '../../models/Agendamento'
import Usuario from '../../models/Usuario'
import Aula from '../../models/Aula'
import { diaDaSemana } from '../../utils/validacoes'
import { MoreThanOrEqual } from 'typeorm'
//import axios from 'axios'

export default class AgendamentoController {
    static async store(req: Request, res: Response){

        const { data, idAula, obs } = req.body
        const idUsuario = req.headers.userId

        const hoje = new Date()

        if (!idUsuario || isNaN(Number(idUsuario))) return res.status(401).json({ error: 'Usuário não autenticado' })

        const usuario = await Usuario.findOneBy({id: Number(idUsuario)})

        if (usuario?.tipo == "Administrador" || usuario?.tipo == "Professor") return res.status(403).json("Usuário não possui permissão de acesso")
        
        if(!idAula || isNaN(Number(idAula))) return res.status(401).json({ error: 'Aula inválida' })
				
        const aula = await Aula.findOneBy({ id: Number(idAula) })
        if (!aula || !data ) return res.status(400).json({error: 'Aula e data devem ser preenchidas!'})

        const data2 = new Date(data)
        const diaSemana = diaDaSemana(data2)
        console.log(diaSemana)

        if (new Date(data) < hoje || aula.dia_semana !== diaSemana) return res.status(401).json("Data inválida")
        
        if (usuario !== null)
        {
          const agendamentos = await Agendamento.find()
          agendamentos.forEach(a => {
          if (data == a.data && aula == a.aula && usuario == a.usuario) 
            return res.status(409).json("Usuário já está agendado para esta aula")
        }) 

          const agendamento = new Agendamento()
          agendamento.data = data
          agendamento.aula = aula
          agendamento.observacao = obs
          agendamento.usuario = usuario

          await agendamento.save()
        
          return res.status(201).json(agendamento)
        }
        return res.json('Erro com usuário')
    }
   
    static async show (req: Request, res: Response){
		    const idUsuario = req.headers.userId
        const hoje = new Date()

        if (!idUsuario || isNaN(Number(idUsuario))) res.status(401).json({ error: 'Usuário não autenticado' })
        const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
        if (usuario !== null){
        if (usuario?.tipo == "Professor") {

          const aulas = await Aula.find({
            where: { usuario: usuario },
            relations: ['agendamentos', 'sala'] 
           })

           const contagemAlunos = new Map<number, Map<string, number>>()
           aulas.forEach(aula => {
           
            if (!contagemAlunos.has(aula.id)) {
              contagemAlunos.set(aula.id, new Map<string, number>());
            }
          
            const dataContagem = contagemAlunos.get(aula.id)!;
            aula.agendamentos.forEach(agendamento => {
                const dataConv = agendamento.data.toISOString().split('T')[0]
                const count = dataContagem.get(dataConv) || 0
                dataContagem.set(dataConv, count + 1)
            })
        })
          console.log("Consulta: agendamentos - Professor")
       
          const resultado = aulas.flatMap(aula => 
            aula.agendamentos.map(agendamento => {
              const dataConv = agendamento.data.toISOString().split('T')[0]
              const quantidadeAluno = contagemAlunos.get(aula.id)?.get(dataConv) || 0
                
              return {
                local: aula.sala,
                quantidadeAluno,
                data: agendamento.data,
                obs: agendamento.observacao,
                dia_semana: aula.dia_semana || '',
                horario: `${aula.horario_inicio} - ${aula.horario_fim}`,
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
            relations: ['aula']
        } )

      let sala: string, idioma: string

        async function dados(agendamento: Agendamento){
          const aula = await Aula.find({ where: {id: agendamento.aula.id}, relations: ['idioma', 'sala'] })
          console.log('Aula: ', aula)
          const salaA = aula.map(m => (`${m.sala} ${m.sala.numero}`))
          const idiomaA = aula.map(m => (m.idioma.nome))

            sala = salaA[0]
            idioma = idiomaA[0]
          }

          const resultado = await Promise.all(agendamentos.map(async (agendamento) => {
            await dados(agendamento)
    
            return {
                id: agendamento.id,
                sala,
                idioma,
                data: agendamento.data,
                obs: agendamento.observacao,
                dia_semana: agendamento.aula?.dia_semana || '',
                horario: `${agendamento.aula?.horario_inicio} - ${agendamento.aula?.horario_fim}`,
            }
        }))
        return res.status(200).json(resultado)
        }
      
      }}
    }

