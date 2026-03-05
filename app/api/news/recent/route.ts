import { NextResponse } from 'next/server'
import { getRecentNews } from '@/lib/news-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const news = await getRecentNews(4)
  return NextResponse.json(news)
}
