import { ObjectId } from 'mongodb'
import clientPromise from './mongodb'
import fs from 'fs'
import path from 'path'

export interface NewsItem {
  id: string
  title: string
  description: string
  content: string
  author: string
  city: string
  image: string
  youtubeLink: string
  isLive: boolean
  createdAt: string
}

function getLocalNewsFilePath() {
  return path.join(process.cwd(), 'data', 'news.json')
}

function readLocalNews(): NewsItem[] {
  try {
    const filePath = getLocalNewsFilePath()
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data) as NewsItem[]
  } catch {
    return []
  }
}

function writeLocalNews(news: NewsItem[]) {
  try {
    const filePath = getLocalNewsFilePath()
    fs.writeFileSync(filePath, JSON.stringify(news, null, 2))
  } catch {
    // Silent fail
  }
}

async function getCollection() {
  if (!clientPromise) {
    return null
  }
  const client = await clientPromise
  const db = client.db('mpnews')
  return db.collection('news')
}

function toNewsItem(doc: Record<string, unknown>): NewsItem {
  return {
    id: (doc._id as ObjectId).toString(),
    title: doc.title as string,
    description: doc.description as string,
    content: doc.content as string,
    author: doc.author as string,
    city: doc.city as string,
    image: doc.image as string,
    youtubeLink: doc.youtubeLink as string,
    isLive: doc.isLive as boolean,
    createdAt: doc.createdAt as string,
  }
}

export async function getAllNews(): Promise<NewsItem[]> {
  const col = await getCollection()
  if (!col) {
    return readLocalNews().sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }
  const docs = await col.find({}).sort({ createdAt: -1 }).toArray()
  return docs.map(doc => toNewsItem(doc as unknown as Record<string, unknown>))
}

export async function getNewsById(id: string): Promise<NewsItem | undefined> {
  const col = await getCollection()
  if (!col) {
    return readLocalNews().find(item => item.id === id)
  }
  let doc
  try {
    doc = await col.findOne({ _id: new ObjectId(id) })
  } catch {
    return undefined
  }
  if (!doc) return undefined
  return toNewsItem(doc as unknown as Record<string, unknown>)
}

export async function getNewsByCity(city: string): Promise<NewsItem[]> {
  const col = await getCollection()
  if (!col) {
    return readLocalNews()
      .filter(item => item.city.toLowerCase() === city.toLowerCase())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
  const docs = await col
    .find({ city: { $regex: new RegExp(`^${city}$`, 'i') } })
    .sort({ createdAt: -1 })
    .toArray()
  return docs.map(doc => toNewsItem(doc as unknown as Record<string, unknown>))
}

export async function getRecentNews(limit = 4): Promise<NewsItem[]> {
  const col = await getCollection()
  if (!col) {
    return readLocalNews()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
  }
  const docs = await col.find({}).sort({ createdAt: -1 }).limit(limit).toArray()
  return docs.map(doc => toNewsItem(doc as unknown as Record<string, unknown>))
}

export async function addNews(item: Omit<NewsItem, 'id' | 'createdAt'>): Promise<NewsItem> {
  const col = await getCollection()
  const now = new Date().toISOString()
  
  if (!col) {
    const news = readLocalNews()
    const newItem: NewsItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: now,
    }
    news.push(newItem)
    writeLocalNews(news)
    return newItem
  }
  
  const result = await col.insertOne({
    ...item,
    createdAt: now,
  })
  return {
    ...item,
    id: result.insertedId.toString(),
    createdAt: now,
  }
}

export async function updateNews(id: string, item: Partial<Omit<NewsItem, 'id' | 'createdAt'>>): Promise<NewsItem | undefined> {
  const col = await getCollection()
  
  if (!col) {
    const news = readLocalNews()
    const index = news.findIndex(n => n.id === id)
    if (index === -1) return undefined
    
    const updatedItem = { ...news[index], ...item }
    news[index] = updatedItem
    writeLocalNews(news)
    return updatedItem
  }
  
  try {
    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: item },
      { returnDocument: 'after' }
    )
    if (!result) return undefined
    return toNewsItem(result as unknown as Record<string, unknown>)
  } catch {
    return undefined
  }
}

export async function deleteNews(id: string): Promise<boolean> {
  const col = await getCollection()
  
  if (!col) {
    const news = readLocalNews()
    const index = news.findIndex(n => n.id === id)
    if (index === -1) return false
    
    news.splice(index, 1)
    writeLocalNews(news)
    return true
  }
  
  try {
    const result = await col.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  } catch {
    return false
  }
}
