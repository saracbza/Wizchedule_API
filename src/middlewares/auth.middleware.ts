import { Request, Response, NextFunction } from "express"
import Token from "../models/Token"

export default async function authMiddleware
(req: Request, res: Response, next: NextFunction){
    const { token } = req.cookies

    if (!token) return res.status(401).json({error: "Token não informado"})

    const userToken = await Token.findOneBy({token: token})
    if (!userToken) return res.status(401).json()

    if (userToken.expiredAt< new Date()){
        await userToken.remove()
        return res.status(401).json()
    }

    req.headers.userId = userToken.userId.toString()

    next() //permite seguir para a prox funcao
}