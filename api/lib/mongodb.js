import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

// Be tolerant if DB is not configured in the environment so API routes can
// return graceful fallbacks instead of crashing with 500.
let clientPromise = null

if (uri && typeof uri === 'string' && uri.trim().length > 0) {
  let client
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  } else {
    client = new MongoClient(uri)
    clientPromise = client.connect()
  }
}

export default clientPromise
