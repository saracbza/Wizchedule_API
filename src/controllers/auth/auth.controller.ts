import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import Usuario from '../../models/Usuario' 
import { emailInstitucional } from '../../utils/validacoes'
const jwt = require('jsonwebtoken')
const SECRET = 'd4f4b4e1e6c2efc1f5b4c9a5e6a8e11d908b7cf4a2d7e93a6f5f8e4d2b5d1a8c'

export default class AuthController {

static async store (req: Request, res: Response){
        const { nome, email, senha, curso, tipo } = req.body 
        
        if(!nome || !tipo ) return res.status(400).json({error: "Nome e tipo obrigatórios!"})
        
        if(!email || !senha) return res.status(400).json({error: "Email e senha obrigatórios!"})
        if(!emailInstitucional(email)) return res.status(400).json({error: "Email inválido!"})
        
        const usuarioCheck = await Usuario.findOneBy({ email })
        if (usuarioCheck) return res.status(400).json({ error: 'Email já cadastrado' })
        
        if (tipo == "Aluno") //aluno
	        if(!curso) return res.status(400).json({error: "Curso obrigatório"})
        
		const usuario = new Usuario()
		usuario.nome = nome
		usuario.email = email
	    usuario.senha = bcrypt.hashSync(senha, 10)
	    usuario.curso = curso ?? ""
        usuario.tipo = tipo
	    await usuario.save() 
	        
		return res.json({
	       nome: usuario.nome,
	       email: usuario.email,
	       curso: usuario.curso ?? ""
        }) 
	      }

    static async login (req: Request, res: Response){
        const { email, senha } = req.body

        if (!email || !senha) return res.status(400).json({error: "Email e senha são obrigatórios"})

        const usuario = await Usuario.findOneBy ({ email })
        if (!usuario) return res.status(401).json({error: "Usuário não encontrado"})
        const idUsuario = usuario.id

	    const senhaCheck = bcrypt.compareSync(senha, usuario.senha)
	    if (!senhaCheck) return res.status(401).json({error: "Senha inválida"})

	    const token = jwt.sign({idUsuario}, SECRET, { expiresIn: '1h'})
        return res.json({ auth: true, token })
    }

    static async logout (req: Request, res: Response) {
        const idUsuario = req.headers.userId
        const usuario = await Usuario.findOneBy ({ id: Number(idUsuario) })
        res.removeHeader('x-access-token')
    
       // res.status(204).json(`Usuário ${usuario} saiu`)
    }
}