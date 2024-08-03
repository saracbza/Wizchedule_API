import { Request, Response } from 'express'
import Agendamento from '../../models/Agendamento'
import Usuario from '../../models/Usuario'
import Monitoria from '../../models/Monitoria'

export default class AgendamentoController {
    static async store(req: Request, res: Response){
        const { data, idMonitoria, obs } = req.body
        const { idUsuario } = req.headers

        if (!idUsuario) return res.status(401).json({ error: 'Usuário não autenticado' })
        
        //verificacao se é um aluno
        const usuario = await Usuario.findOneBy({ id: Number(idUsuario) })
        if (usuario !== null) if (usuario.curso == "Monitoria") res.json('Usuário é monitor')
        
        if(!idMonitoria || isNaN(Number(idMonitoria))) return res.status(401).json({ error: 'Monitoria inválida' })
				const monitoria = await Monitoria.findOneBy({ id: Number(idMonitoria) })
			
        if (!monitoria || !data || !obs){
            return res.status(400).json({error: 'Todos os dados são obrigatórios!'})
        }
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
    
    //mostrar todos agendamentos(se aluno = todos seus agendamentos, se monitor = todos agendamentos da sua materia
    static async show (req: Request, res: Response){
		    const { idUsuario } = req.headers
		   
        const usuario = await Usuario.findOneBy({ id: Number(idUsuario) })
        if (!usuario) res.json('Usuário não autenticado')
        let agendamentos: Agendamento[] = []
        if (usuario !== null) {
          if (usuario.curso == "Monitoria")
            {  
	        //encontrar as monitorias deste monitor para poder retornar os agendamentos delas
				      const monitorias = await Monitoria.find({
				       where: { usuario: usuario },
				       relations: ['agendamentos'] 
					     })
				    	agendamentos = monitorias.flatMap(monitoria => monitoria.agendamentos)
             }                   
          else agendamentos = await Agendamento.find({ where: { usuario: usuario } }) 			
        
        return res.json(agendamentos)}
        res.json('Usuário não existe')
    }
   
   
}