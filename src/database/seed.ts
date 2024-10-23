import Local from "../models/Local"
import Materia from "../models/Materia"
import Monitoria from "../models/Monitoria"
import Usuario from "../models/Usuario"
import { opcoesCursos, TipoLocal } from "../utils/validacoes"
import bcrypt from 'bcrypt'

async function seed() {
    const cadastrar = false

    if (cadastrar){
    console.log('Iniciando cadastros...')

    const usuarios = [
        { email:'teste', nome: 'Teste Gonçalves', //1
            senha: bcrypt.hashSync("teste", 10), curso: opcoesCursos.ads, tipo:'Aluno', idFoto: 2 },

        { email:'jose@fatec.sp.gov.br', nome: 'Jose Alves', //1
            senha: bcrypt.hashSync("senha123", 10), curso: opcoesCursos.vazio, tipo:'Monitor', idFoto: 3 }, 

        { email:'maria@fatec.sp.gov.br', nome: 'Maria Aparecida', //2
            senha: bcrypt.hashSync("123456789", 10), curso: opcoesCursos.gstE, tipo:'Aluno', idFoto: 3  },

        { email:'rafaela@fatec.sp.gov.br', nome: 'Rafaela Gomes', //3
            senha: bcrypt.hashSync("senhatop", 10), curso: opcoesCursos.ads, tipo:'Aluno' },

        { email:'marcos@fatec.sp.gov.br', nome: 'Marcos Roberto', //4
            senha: bcrypt.hashSync("roberto115", 10), curso: opcoesCursos.vazio, tipo:'Monitor', idFoto: 4 },

        { email:'vanessa@fatec.sp.gov.br', nome: 'Vanessa Manuela', //5
            senha: bcrypt.hashSync("algumacoisa", 10), curso: opcoesCursos.comex, tipo: 'Aluno', idFoto: 2 }
    ]

    await Promise.all(usuarios.map(async (dados) => { 
        const usuario = new Usuario()
        usuario.email = dados.email
        usuario.nome = dados.nome
        usuario.senha = dados.senha
        usuario.tipo = dados.tipo
        usuario.curso = dados.curso
        usuario.idFoto = dados.idFoto ? dados.idFoto : 1
        await usuario.save() 
      }))

      const jose = await Usuario.findOneBy({nome: "Jose Alves"})
      const marcos = await Usuario.findOneBy({nome: "Marcos Roberto"})

    const materias = [
        { nome: 'Informática' }, //1
        { nome: 'Contabilidade' } //2
    ]

    await Promise.all(materias.map(async (dados) => { 
        const materia = new Materia()
        materia.nome = dados.nome
        await materia.save() 
      }))

    const info = await Materia.findOneBy({nome: 'Informática'})
    const cont = await Materia.findOneBy({nome: 'Contabilidade'})

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

    const local1 = await Local.findOneBy({id: 1})
    const local2 = await Local.findOneBy({id: 2})
    const local3  = await Local.findOneBy({id: 3})

    const monitorias = [
        { dia_semana: 'Segunda-feira', horario_inicio: '09:30', horario_fim: '10:30', //1
            usuario: jose, materia: info, local: local1
         },
         { dia_semana: 'Terça-feira', horario_inicio: '15:00', horario_fim: '18:30', //2
            usuario: jose, materia: info, local: local1
         },
         { dia_semana: 'Quarta-feira', horario_inicio: '09:30', horario_fim: '10:30', //3
            usuario: marcos, materia: cont, local: local1
         },
         { dia_semana: 'Quarta-feira', horario_inicio: '09:30', horario_fim: '10:30', //4
            usuario: jose, materia: info, local: local2
         },
         { dia_semana: 'Quinta-feira', horario_inicio: '17:30', horario_fim: '18:00', //5
            usuario: marcos, materia: cont, local: local3
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
    else console.log('Ok!')
}

export default seed