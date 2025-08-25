import clientPromise from '../lib/mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body
      
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' })
      }
      
      const client = await clientPromise
      const db = client.db('oilpainting')
      const collection = db.collection('users')
      
      const user = await collection.findOne({ username })
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }
      
      const isValidPassword = await bcrypt.compare(password, user.passwordHash)
      
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }
      
      if (user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' })
      }
      
      const token = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      )
      
      res.status(200).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        }
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ error: 'Login failed' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
