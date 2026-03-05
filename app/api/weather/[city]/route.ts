import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const apiKey = process.env.WEATHER_API_KEY

  if (!apiKey) {
    return NextResponse.json({
      city,
      temp: '--',
      description: 'API key not configured',
    })
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},IN&units=metric&appid=${apiKey}`
    const res = await fetch(url, { cache: 'no-store' })
    
    if (!res.ok) {
      const errorData = await res.json()
      console.error('Weather API error:', errorData)
      return NextResponse.json({
        city,
        temp: '--',
        description: errorData.message || 'API Error',
      })
    }
    
    const data = await res.json()
    return NextResponse.json({
      city: data.name || city,
      temp: Math.round(data.main?.temp ?? 0),
      description: data.weather?.[0]?.description || 'N/A',
    })
  } catch (error) {
    console.error('Weather fetch error:', error)
    return NextResponse.json({ city, temp: '--', description: 'Error' })
  }
}
