import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import Usuario from '../../models/Usuario' 
import Token from '../../models/Token'
import { emailInstitucional } from '../../utils/Utils'

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
	    usuario.curso = curso
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

	       const senhaCheck = bcrypt.compareSync(senha, usuario.senha)
	       if (!senhaCheck) return res.status(401).json({error: "Senha inválida"})
	        
	       await Token.delete({ usuario: { id: usuario.id } })

	       const token = new Token()
        
           const random = new Date().toString()
	       const stringRand = new Date().toString() + bcrypt.hashSync(random, 1)
	       token.token = bcrypt.hashSync(stringRand, 1).slice(-20)

	       token.expiredAt = new Date (Date.now()+60*60*1000) //expirar token em 1 hora

	       token.refreshToken = bcrypt.hashSync(stringRand+2, 1).slice(-20)

	       token.usuario = usuario
	       await token.save()

	        //add o token em um cookie
	       res.cookie('token', token.token, {httpOnly: true, secure: true, sameSite: 'none'})

	       return res.json({
           token: token.token,
           expiredAt: token.expiredAt,
           refreshToken: token.refreshToken
        })	        
    }

    static async refresh (req: Request, res: Response) {
        const { authorization } = req.cookies
    
        if (!authorization) return res.status(400).json({ error: 'O refresh token é obrigatório' })
    
        const token = await Token.findOneBy({ refreshToken: authorization })
        if (!token) return res.status(401).json({ error: 'Refresh token inválido' })
    
        if (token.expiredAt < new Date()) {
          await token.remove()
          return res.status(401).json({ error: 'Refresh token expirado' })
        }
    
        token.token = bcrypt.hashSync(Math.random().toString(36), 1).slice(-20)
        token.refreshToken = bcrypt.hashSync(Math.random().toString(36), 1).slice(-20)
        token.expiredAt = new Date(Date.now() + 60 * 60 * 1000)
        await token.save()

        //add o token em um cookie
        res.cookie('token', token.token, {httpOnly: true, secure: true, sameSite: 'none'})
    
        return res.json({
          token: token.token,
          expiresAt: token.expiredAt,
          refreshToken: token.refreshToken
        })
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