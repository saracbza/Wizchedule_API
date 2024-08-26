import e, { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import Usuario from '../../models/Usuario' 
import { emailInstitucional } from '../../utils/Utils'
const jwt = require('jsonwebtoken')
const SECRET = 'd4f4b4e1e6c2efc1f5b4c9a5e6a8e11d908b7cf4a2d7e93a6f5f8e4d2b5d1a8c'

export default class AuthController{

static async store (req: Request, res: Response){
        const { nome,email,senha,curso,adm } = req.body 
        //adm é o responsavel pelo cadastro de monitores e materias (so ele tera acesso as telas de cadastro)
	    const validacao = adm ? true : false

        if(!nome) return res.status(400).json({error: "Nome obrigatório!"})
        
        
        if(!email || !senha) return res.status(400).json({error: "Email e senha obrigatórios!"})
        if(!emailInstitucional(email)) return res.status(400).json({error: "Email inválido!"})
        
        const usuarioCheck = await Usuario.findOneBy({ email })
        if (usuarioCheck) return res.status(400).json({ error: 'Email já cadastrado' })
        
        if (!validacao) //aluno
	        if(!curso) return res.status(400).json({error: "Curso obrigatório"})
        
        const monitor = "Monitoria"
		const usuario = new Usuario()
		usuario.nome = nome
		usuario.email = email
	    usuario.senha = bcrypt.hashSync(senha, 10)
	    usuario.curso = curso ?? monitor
	    await usuario.save() 
	        
		return res.json({
	       nome: usuario.nome,
	       email: usuario.email,
	       curso: usuario.curso
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

    static async refresh (req: Request, res: Response) {
        const { authorization } = req.cookies
    
        if (!authorization) return res.status(400).json({ error: 'O refresh token é obrigatório' })
    
    }

    static async logout (req: Request, res: Response) {
        const { token } = req.cookies
        
        if (!token) return res.status(400).json({ error: 'O token é obrigatório' })
    
        const usuarioToken = await Token.findOneBy({ token: token })
        if (!usuarioToken) return res.status(401).json({ error: 'Token inválido' })
    
        await usuarioToken.remove()

        res.clearCookie('token')
    
        return res.status(204).json()
    }
}