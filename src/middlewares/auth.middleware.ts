import { Request, Response, NextFunction } from 'express'
const jwt = require('jsonwebtoken')
const SECRET = 'd4f4b4e1e6c2efc1f5b4c9a5e6a8e11d908b7cf4a2d7e93a6f5f8e4d2b5d1a8c'

export default async function authMiddleware (req: Request, res: Response, next: NextFunction) {
  const token = req.headers['x-access-token']

  jwt.verify(token, SECRET, (err: any, decoded: any) => {
    if (err) return res.status(401).json(err)
    
    req.headers.userId = decoded.idUsuario   

    next()
  })
}