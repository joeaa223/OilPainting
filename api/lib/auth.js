import jwt from 'jsonwebtoken'

export function verifyToken(req, res, next) {
  return new Promise((resolve, reject) => {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      reject(new Error('Access token required'))
      return
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded
      resolve()
    } catch (error) {
      reject(new Error('Invalid token'))
    }
  })
}

export function requireAdmin(req, res, next) {
  return new Promise((resolve, reject) => {
    if (!req.user || req.user.role !== 'admin') {
      reject(new Error('Admin access required'))
      return
    }
    resolve()
  })
}
