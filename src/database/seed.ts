import Sala from "../models/Sala"
import Idioma from "../models/Idioma"
import Aula from "../models/Aula"
import Usuario from "../models/Usuario"
import bcrypt from 'bcrypt'

async function seed() {
    const cadastrar = false 

    if (cadastrar){
    console.log('Iniciando cadastros...')

    const usuarios = [
        { email:'adm', nome: 'Administrador Johnson', //adm
            senha: bcrypt.hashSync("adm", 10), tipo:'Administrador', idFoto: 1 },

        /*{ email:'teste', nome: 'Teste Gonçalves', //1
            senha: bcrypt.hashSync("teste", 10), tipo:'Aluno', idFoto: 2 },*/

        { email:'jose@gmail.com', nome: 'Jose Alves', //1
            senha: bcrypt.hashSync("senha123", 10), tipo:'Professor', idFoto: 3 }, 

        { email:'maria@gmail.com', nome: 'Maria Aparecida', //2
            senha: bcrypt.hashSync("123456789", 10), tipo:'Aluno', idFoto: 3  },

        { email:'rafaela@gmail.com', nome: 'Rafaela Gomes', //3
            senha: bcrypt.hashSync("senhatop", 10), tipo:'Aluno' },

        { email:'marcos@email.com', nome: 'Marcos Roberto', //4
            senha: bcrypt.hashSync("roberto115", 10), tipo:'Professor', idFoto: 4 },

        { email:'vanessa@teste.mg.gov.br', nome: 'Vanessa Manuela', //5
            senha: bcrypt.hashSync("algumacoisa", 10), tipo: 'Aluno', idFoto: 2 }
    ]

    await Promise.all(usuarios.map(async (dados) => { 
        const usuario = new Usuario()
        usuario.email = dados.email
        usuario.nome = dados.nome
        usuario.senha = dados.senha
        usuario.tipo = dados.tipo
        usuario.idFoto = dados.idFoto ? dados.idFoto : 1
        await usuario.save() 
      }))

      const jose = await Usuario.findOneBy({nome: "Jose Alves"})
      const marcos = await Usuario.findOneBy({nome: "Marcos Roberto"})

    const idiomas = [
        { nome: 'Alemão' },
        { nome: 'Inglês' }
    ]

    await Promise.all(idiomas.map(async (dados) => { 
        const idioma = new Idioma()
        idioma.nome = dados.nome
        await idioma.save() 
      }))

    const alemao = await Idioma.findOneBy({nome: 'Alemão'})
    const ingles = await Idioma.findOneBy({nome: 'Inglês'})

    const salas = [
        { numero: 5 }, 
        { numero: 3 },
        { numero: 2 } 
    ]

    await Promise.all(salas.map(async (dados) => { 
        const sala = new Sala()
        sala.numero = dados.numero
        await sala.save() 
      }))

    const sala1 = await Sala.findOneBy({id: 1})
    const sala2 = await Sala.findOneBy({id: 2})
    const sala3  = await Sala.findOneBy({id: 3})

    const aulas = [
        { dia_semana: 'Segunda-feira', horario_inicio: '09:30', horario_fim: '10:30', //1
            usuario: jose, idioma: alemao, sala: sala2
         },
         { dia_semana: 'Terça-feira', horario_inicio: '15:00', horario_fim: '18:30', //2
            usuario: jose, idioma: alemao, sala: sala1
         },
         { dia_semana: 'Quarta-feira', horario_inicio: '09:30', horario_fim: '10:30', //3
            usuario: marcos, idioma: ingles, sala: sala3
         },
         { dia_semana: 'Quarta-feira', horario_inicio: '09:30', horario_fim: '10:30', //4
            usuario: jose, idioma: alemao, sala: sala1
         },
         { dia_semana: 'Quinta-feira', horario_inicio: '17:30', horario_fim: '18:00', //5
            usuario: marcos, idioma: ingles, sala: sala2
         }
    ]
    await Promise.all(aulas.map(async (dados) => { 
        if (dados.usuario && dados.idioma && dados.sala){
        const aula = new Aula()
        aula.dia_semana = dados.dia_semana
        aula.horario_inicio = dados.horario_inicio
        aula.horario_fim = dados.horario_fim
        aula.usuario = dados.usuario
        aula.idioma = dados.idioma
        aula.sala = dados.sala
        await aula.save() 
     }
      }))
      console.log('Finalizando cadastros...')
    }
    else console.log('Ok!')
}

export default seed