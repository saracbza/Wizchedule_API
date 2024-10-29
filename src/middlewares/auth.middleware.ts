import { Request, Response, NextFunction } from 'express'
import { LocalStorage } from 'node-localstorage'

const jwt = require('jsonwebtoken')
const localStorage = new LocalStorage('./scratch')

export default async function authMiddleware (req: Request, res: Response, next: NextFunction) {
  
  //const token = axios.defaults.headers.common['x-access-token']
  const token = localStorage.getItem('token')
  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' })

  const secret = localStorage.getItem('secret')
  if (!secret) return res.json({auth: false, message: 'No secret'})

  jwt.verify(token, secret, (err: any, decoded: any) => {
    if (err) return res.status(500).json("Failed to authenticate token")
    
    req.headers.userId = decoded.idUsuario

    next()
  })
}