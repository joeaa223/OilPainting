import clientPromise from './lib/mongodb'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise
      const db = client.db('oilpainting')
      const collection = db.collection('artworks')
      
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
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
