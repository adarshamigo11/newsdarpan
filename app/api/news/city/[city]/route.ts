import { NextResponse } from 'next/server'
import { getNewsByCity } from '@/lib/news-store'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const news = await getNewsByCity(city)
  return NextResponse.json(news)
}
