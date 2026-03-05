import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
    }

    const client = await clientPromise
    
    if (!client) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
    }

    const db = client.db('mpnews')
    const collection = db.collection('contact_messages')

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    const client = await clientPromise
    
    if (!client) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
    }

    const db = client.db('mpnews')
    const collection = db.collection('contact_messages')

    const result = await collection.insertOne({
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
      read: false
    })

    return NextResponse.json({ success: true, id: result.insertedId.toString() })
  } catch {
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const client = await clientPromise
    
    if (!client) {
      return NextResponse.json({ messages: [] })
    }

    const db = client.db('mpnews')
    const collection = db.collection('contact_messages')

    const messages = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ 
      messages: messages.map(m => ({
        id: m._id.toString(),
        name: m.name,
        email: m.email,
        message: m.message,
        createdAt: m.createdAt,
        read: m.read
      }))
    })
  } catch {
    return NextResponse.json({ messages: [] })
  }
}
