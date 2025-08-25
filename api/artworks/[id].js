import clientPromise from '../lib/mongodb.js'
import { ObjectId } from 'mongodb'
import { verifyToken, requireAdmin } from '../lib/auth.js'

export default async function handler(req, res) {
  if (!clientPromise) {
    return res.status(503).json({ error: 'Database is not configured' })
  }
  const { id } = req.query
  
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid artwork ID' })
  }

  const client = await clientPromise
  const db = client.db('oilpainting')
  const collection = db.collection('artworks')

  switch (req.method) {
    case 'GET':
      try {
        const artwork = await collection.findOne({ _id: new ObjectId(id) })
        
        if (!artwork) {
          return res.status(404).json({ error: 'Artwork not found' })
        }
        
        res.status(200).json(artwork)
      } catch (error) {
        console.error('Error fetching artwork:', error)
        res.status(500).json({ error: 'Failed to fetch artwork' })
      }
      break

    case 'DELETE':
      // 验证管理员权限
      try {
        await verifyToken(req, res)
        await requireAdmin(req, res)
      } catch (error) {
        return res.status(401).json({ error: error.message })
      }

      try {
        const result = await collection.deleteOne({ _id: new ObjectId(id) })
        
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Artwork not found' })
        }
        
        res.status(200).json({ message: 'Artwork deleted successfully' })
      } catch (error) {
        console.error('Delete artwork error:', error)
        res.status(500).json({ error: 'Failed to delete artwork' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
