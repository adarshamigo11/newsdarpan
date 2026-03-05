import { NextResponse } from 'next/server'
import { getAllNews, addNews } from '@/lib/news-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const news = await getAllNews()
  return NextResponse.json(news)
}

export async function POST(request: Request) {
  const body = await request.json()
  const item = await addNews(body)
  return NextResponse.json(item, { status: 201 })
}
