import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '')
      
      if (!token) {
        return res.status(401).json({ error: 'Access token required' })
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      res.status(200).json({
        user: {
          id: decoded.userId,
          username: decoded.username,
          role: decoded.role
        }
      })
    } catch (error) {
      console.error('Token verification error:', error)
      res.status(401).json({ error: 'Invalid token' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
