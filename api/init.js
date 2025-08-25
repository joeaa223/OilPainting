import clientPromise from './lib/mongodb.js'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const client = await clientPromise
    const db = client.db('oilpainting')
    const collection = db.collection('users')
    
    // 检查是否已有管理员用户
    const existingAdmin = await collection.findOne({ role: 'admin' })
    
    if (existingAdmin) {
      return res.status(200).json({ message: 'Admin user already exists' })
    }
    
    // 创建默认管理员用户
    const passwordHash = await bcrypt.hash('admin123', 10)
    
    await collection.insertOne({
      email: 'admin@jeffryart.com',
      passwordHash,
      role: 'admin',
      createdAt: new Date()
    })
    
    res.status(201).json({ 
      message: 'Default admin user created successfully',
      email: 'admin@jeffryart.com',
      password: 'admin123'
    })
  } catch (error) {
    console.error('Init error:', error)
    res.status(500).json({ error: 'Failed to initialize' })
  }
}
