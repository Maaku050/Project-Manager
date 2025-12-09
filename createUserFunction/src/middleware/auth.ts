import { Request, Response, NextFunction } from 'express'
import admin from 'firebase-admin'

export interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken
}

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' })
    }

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await admin.auth().verifyIdToken(token)

    req.user = decodedToken
    next()
  } catch (error) {
    console.error('Token verification error:', error)
    return res.status(401).json({ error: 'Unauthorized: Invalid token' })
  }
}
