import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import Usuario from '../../models/Usuario' 
import { emailInstitucional } from '../../utils/validacoes'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { LocalStorage } from 'node-localstorage'
import crypto from 'crypto'

const localStorage = new LocalStorage('./scratch')

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

        const secret = crypto.randomBytes(32).toString('hex')
	    const token = jwt.sign({idUsuario}, secret, { expiresIn: '1h'})

        localStorage.setItem('secret', secret)
        localStorage.setItem('token', token)

        //axios.defaults.headers.common['x-access-token'] = token

        return res.status(200).json({ 
            nome: usuario.nome, 
            curso: usuario.curso, 
            tipo: usuario.tipo, 
            token })
    }

    static async logout (req: Request, res:Response) {
        const idUsuario = req.headers.userId
        const usuario = await Usuario.findOneBy ({ id: Number(idUsuario) })
        //delete axios.defaults.headers.common['x-access-token']
        localStorage.removeItem('token')
        localStorage.removeItem('secret')
        console.log(`Usuário ${usuario?.nome} saiu`)
        return res.json({auth: false})
    }
}