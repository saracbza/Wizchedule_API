import Local from "../models/Local"
import Materia from "../models/Materia"
import Monitoria from "../models/Monitoria"
import Usuario from "../models/Usuario"
import { TipoLocal } from "../utils/validacoes"

async function seed() {
    const cadastrar = true

    if (cadastrar){
    console.log('Iniciando cadastros...')
    const usuarios = [
        { email:'jose@fatec.sp.gov.br', nome: 'Jose Alves', //1
            senha: 'senha123', curso: '', tipo:'Monitor' }, 

        { email:'maria@fatec.sp.gov.br', nome: 'Maria Aparecida', //2
            senha: '123456789', curso: 'Gestão Empresarial', tipo:'Aluno' },

        { email:'rafaela@fatec.sp.gov.br', nome: 'Rafaela Gomes', //3
            senha: 'senhatop', curso: 'Análise e Desenvolvimento de Sistemas', tipo:'Aluno' },

        { email:'marcos@fatec.sp.gov.br', nome: 'Marcos Roberto', //4
            senha: 'roberto115', curso: '', tipo:'Monitor' },

        { email:'vanessa@fatec.sp.gov.br', nome: 'Vanessa Manuela', //5
            senha: 'algumacoisa', curso: 'Comércio Exterior', tipo: 'Aluno' }
    ]

    await Promise.all(usuarios.map(async (dados) => { 
        const usuario = new Usuario()
        usuario.email = dados.email
        usuario.nome = dados.nome
        usuario.senha = dados.senha
        usuario.tipo = dados.tipo
        await usuario.save() 
      }))

      const jose = await Usuario.findOneBy({id: 1})
      const marcos = await Usuario.findOneBy({id: 4})

    const materias = [
        { nome: 'Informática' }, //1
        { nome: 'Contabilidade' } //2
    ]

    await Promise.all(materias.map(async (dados) => { 
        const materia = new Materia()
        materia.nome = dados.nome
        await materia.save() 
      }))

    const info = await Materia.findOneBy({id: 1})
    const cont = await Materia.findOneBy({id: 2})

    const locais = [
        { numero: 5, tipo: TipoLocal.sala }, //1
        { tipo: TipoLocal.biblio }, //2
        { numero: 2, tipo: TipoLocal.lab } //3
    ]

    await Promise.all(locais.map(async (dados) => { 
        const local = new Local()
        local.numero = dados.numero
        local.tipo = dados.tipo
        await local.save() 
      }))

    const sala = await Local.findOneBy({id: 1})
    const biblio = await Local.findOneBy({id: 2})
    const lab  = await Local.findOneBy({id: 3})

    const monitorias = [
        { dia_semana: 'Segunda-feira', horario_inicio: '09:30', horario_fim: '10:30', //1
            usuario: jose, materia: info, local: lab
         },
         { dia_semana: 'Terça-feira', horario_inicio: '15:00', horario_fim: '18:30', //2
            usuario: jose, materia: info, local: sala
         },
         { dia_semana: 'Quarta-feira', horario_inicio: '09:30', horario_fim: '10:30', //3
            usuario: marcos, materia: cont, local: lab
         },
         { dia_semana: 'Quarta-feira', horario_inicio: '09:30', horario_fim: '10:30', //4
            usuario: jose, materia: info, local: biblio
         },
         { dia_semana: 'Quinta-feira', horario_inicio: '17:30', horario_fim: '18:00', //5
            usuario: marcos, materia: cont, local: biblio
         }
    ]
    await Promise.all(monitorias.map(async (dados) => { 
        if (dados.usuario && dados.materia && dados.local){
        const monitoria = new Monitoria()
        monitoria.dia_semana = dados.dia_semana
        monitoria.horario_inicio = dados.horario_inicio
        monitoria.horario_fim = dados.horario_fim
        monitoria.usuario = dados.usuario
        monitoria.materia = dados.materia
        monitoria.local = dados.local
        await monitoria.save() 
     }
      }))
      console.log('Finalizando cadastros...')
    }
    else console.log('Seed Ok!')
}

export default seed