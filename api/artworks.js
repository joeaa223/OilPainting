import clientPromise from './lib/mongodb.js'
import { verifyToken, requireAdmin } from './lib/auth.js'
import { ObjectId } from 'mongodb'
import formidable from 'formidable'

// 禁用默认的 body parser 用于文件上传
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  // If database is not configured, return a graceful empty dataset instead of 500
  if (!clientPromise) {
    if (req.method === 'GET') {
      return res.status(200).json({
        items: [],
        total: 0,
        page: 1,
        totalPages: 0,
        isEmpty: true
      })
    }
    return res.status(503).json({ error: 'Database is not configured' })
  }

  const client = await clientPromise
  const db = client.db('oilpainting')
  const collection = db.collection('artworks')

  switch (req.method) {
    case 'GET':
      try {
        const { page = 1, limit = 12, q: searchQuery } = req.query
        const skip = (parseInt(page) - 1) * parseInt(limit)
        
        let query = {}
        if (searchQuery) {
          query.title = { $regex: searchQuery, $options: 'i' }
        }
        
        const [artworks, total] = await Promise.all([
          collection.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .toArray(),
          collection.countDocuments(query)
        ])
        
        const totalPages = Math.ceil(total / parseInt(limit))
        
        res.status(200).json({
          items: artworks,
          total,
          page: parseInt(page),
          totalPages,
          isEmpty: total === 0
        })
      } catch (error) {
        console.error('Error fetching artworks:', error)
        res.status(500).json({ error: 'Failed to fetch artworks' })
      }
      break

    case 'POST':
      // 验证管理员权限
      try {
        await verifyToken(req, res)
        await requireAdmin(req, res)
      } catch (error) {
        return res.status(401).json({ error: error.message })
      }

      try {
        const form = formidable({
          maxFiles: 12,
          maxFileSize: 10 * 1024 * 1024, // 10MB
        })

        form.parse(req, async (err, fields, files) => {
          if (err) {
            console.error('Form parsing error:', err)
            return res.status(400).json({ error: 'Failed to parse form data' })
          }

          const artworkData = {
            title: Array.isArray(fields.title) ? fields.title[0] : fields.title,
            creationDate: Array.isArray(fields.creationDate) ? fields.creationDate[0] : fields.creationDate,
            description: Array.isArray(fields.description) ? fields.description[0] : fields.description,
            height: Array.isArray(fields.height) ? fields.height[0] : fields.height,
            width: Array.isArray(fields.width) ? fields.width[0] : fields.width,
            depth: Array.isArray(fields.depth) ? fields.depth[0] : fields.depth,
            material: Array.isArray(fields.material) ? fields.material[0] : fields.material,
            withFrame: Array.isArray(fields.withFrame) ? fields.withFrame[0] === 'true' : fields.withFrame === 'true',
            images: [], // 这里应该处理图片上传，暂时为空
            createdAt: new Date(),
            updatedAt: new Date()
          }

          const result = await collection.insertOne(artworkData)
          res.status(201).json({
            id: result.insertedId,
            message: 'Artwork created successfully'
          })
        })
      } catch (error) {
        console.error('Create artwork error:', error)
        res.status(500).json({ error: 'Failed to create artwork' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
