import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

// Only initialize MongoDB if URI is provided and not empty
if (uri && uri.trim() !== '' && !uri.includes('username:password')) {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (process.env.NODE_ENV === 'development') {
    // In development, use a global variable so the MongoClient is not
    // repeatedly created during hot reloads
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    // In production, create a new client for each serverless invocation
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
}

export default clientPromise
