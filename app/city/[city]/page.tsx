import { getNewsByCity } from '@/lib/news-store'
import { NewsCard, EmptyState } from '@/components/news-card'
import { MP_CITIES } from '@/lib/cities'

export const dynamic = 'force-dynamic'

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params
  const cityName = MP_CITIES.find(c => c.toLowerCase() === citySlug.toLowerCase()) || citySlug
  const news = await getNewsByCity(cityName)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="font-serif text-3xl font-bold mb-2 text-foreground">{cityName} News</h2>
      <p className="text-muted-foreground mb-8">Latest news from {cityName}, Madhya Pradesh.</p>
      {news.length === 0 ? (
        <EmptyState message={`No news from ${cityName} yet.`} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map(item => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
