import clientPromise from '../lib/mongodb'
import { verifyToken, requireAdmin } from '../lib/auth'

export default async function handler(req, res) {
  // 验证管理员权限
  try {
    await verifyToken(req, res, () => {})
    await requireAdmin(req, res, () => {})
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const client = await clientPromise
  const db = client.db('oilpainting')
  const collection = db.collection('artworks')

  switch (req.method) {
    case 'POST':
      // 创建新作品
      try {
        const artworkData = {
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        const result = await collection.insertOne(artworkData)
        res.status(201).json({
          id: result.insertedId,
          message: 'Artwork created successfully'
        })
      } catch (error) {
        console.error('Create artwork error:', error)
        res.status(500).json({ error: 'Failed to create artwork' })
      }
      break

    case 'PUT':
      // 更新作品
      try {
        const { id, ...updateData } = req.body
        const result = await collection.updateOne(
          { _id: new (require('mongodb').ObjectId)(id) },
          { 
            $set: { 
              ...updateData, 
              updatedAt: new Date() 
            } 
          }
        )
        
        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Artwork not found' })
        }
        
        res.status(200).json({ message: 'Artwork updated successfully' })
      } catch (error) {
        console.error('Update artwork error:', error)
        res.status(500).json({ error: 'Failed to update artwork' })
      }
      break

    case 'DELETE':
      // 删除作品
      try {
        const { id } = req.query
        const result = await collection.deleteOne({ 
          _id: new (require('mongodb').ObjectId)(id) 
        })
        
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
      res.setHeader('Allow', ['POST', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
