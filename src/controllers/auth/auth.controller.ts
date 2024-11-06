import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import Usuario from '../../models/Usuario' 
import jwt from 'jsonwebtoken'
import { LocalStorage } from 'node-localstorage'
import crypto from 'crypto'

const localStorage = new LocalStorage('./scratch')

export default class AuthController {

static async store (req: Request, res: Response){
    const { nome, email, senha, tipo, idFoto } = req.body
    let idUsuario

    if(!nome || !tipo ) return res.status(400).json({error: "Nome e tipo obrigatórios!"}) 
    if(!email || !senha) return res.status(400).json({error: "Email e senha obrigatórios!"})

    if (tipo == "Professor"){
        const t = localStorage.getItem('token')
        if (!t) return res.status(401).json({ auth: false, message: 'No token provided.' })
  
        const s = localStorage.getItem('secret')
        if (!s) return res.json({auth: false, message: 'No secret'})
  
        jwt.verify(t, s, (err: any, decoded: any) => {
        if (err) return res.status(500).json("Failed to authenticate token")
      
        idUsuario = decoded.idUsuario
    })
    }
       
    if (tipo == "Professor"){
        if(!idUsuario || isNaN(Number(idUsuario))) return res.status(400).json({error: "Login obrigatório para esta ação!"})
        const user = await Usuario.findOneBy ({ id: Number(idUsuario) })
        if (user?.tipo != "Administrador") return res.status(403).json({error: "Apenas administrador pode cadastrar esse tipo de usuário"})
    }
        
    const usuarioCheck = await Usuario.findOneBy({ email })
    if (usuarioCheck) return res.status(409).json({ error: 'Email já cadastrado!' })
        
	const usuario = new Usuario()
	usuario.nome = nome
	usuario.email = email
	usuario.senha = bcrypt.hashSync(senha, 10)
    usuario.tipo = tipo
    usuario.idFoto = idFoto ?? ""
	await usuario.save() 
	        
	return res.status(200).json({
	    nome: usuario.nome,
	    email: usuario.email,
    }) 
}

    static async login (req: Request, res: Response){
        const t = localStorage.getItem('token')
        console.log(t)
        if (!(!t)) return res.status(409).json("Usuário já está autenticado")

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
            tipo: usuario.tipo, 
            foto: usuario.idFoto,
            token })
    }

    static async verify (req: Request, res: Response){
        /*const t = localStorage.getItem('token')
        console.log(t)
        if (!(!t)) return res.status(409).json("Usuário já está autenticado") */

        const { email } = req.body

        if (!email ) return res.status(400).json({error: "Email é obrigatório"})

        const usuario = await Usuario.findOneBy ({ email })
        if (!usuario) return res.status(401).json({error: "Usuário não encontrado"})
        const idUsuario = usuario.id

        const secret = crypto.randomBytes(32).toString('hex')
	    const token = jwt.sign({idUsuario}, secret, { expiresIn: '1h'})

        localStorage.setItem('secret', secret)
        localStorage.setItem('token', token)

        //axios.defaults.headers.common['x-access-token'] = token

        return res.status(200).json({
            nome: usuario.nome, 
            tipo: usuario.tipo, 
            foto: usuario.idFoto,
            token })
    }

    static async change (req: Request, res: Response){
        const { novaSenha } = req.body
        const t = localStorage.getItem('token')
        console.log(t)
        if (!(!t)) return res.status(409).json("Usuário já está autenticado")

        if (!novaSenha) return res.status(400).json({error: "A senha é obrigatória"})

        try {
            const decoded: any = jwt.verify(token, 'secret'); 
    
            const usuario = await Usuario.findOneBy(decoded.idUsuario);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
    
            const hashSenha = await bcrypt.hash(novaSenha, 10);
    
            usuario.senha = hashSenha;  
            await usuario.save();  
    
            return res.status(200).json({ mensagem: 'Senha atualizada com sucesso' });
        } catch (error) {
            // Se o token for inválido ou ocorrer outro erro
            return res.status(400).json({ error: 'Token inválido ou expirado' });
        }
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

    static async mudarFoto (req: Request, res:Response) {
        const idUsuario = req.headers.userId
        const { fotoId } = req.body
        console.log("foto passada: ", Number(fotoId))
        const usuario = await Usuario.findOneBy ({ id: Number(idUsuario) })
        if (usuario !== null){
            usuario.idFoto = Number(fotoId) ? Number(fotoId) : usuario?.idFoto
            await usuario?.save()
        }

        return res.status(200).json('Foto alterada')
    }
}