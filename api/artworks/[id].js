import clientPromise from '../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query
      
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid artwork ID' })
      }
      
      const client = await clientPromise
      const db = client.db('oilpainting')
      const collection = db.collection('artworks')
      
      const artwork = await collection.findOne({ _id: new ObjectId(id) })
      
      if (!artwork) {
        return res.status(404).json({ error: 'Artwork not found' })
      }
      
      res.status(200).json(artwork)
    } catch (error) {
      console.error('Error fetching artwork:', error)
      res.status(500).json({ error: 'Failed to fetch artwork' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
