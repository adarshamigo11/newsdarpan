import { getAllNews } from '@/lib/news-store'
import { NewsCard, EmptyState } from '@/components/news-card'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const news = await getAllNews()

  if (news.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="font-serif text-3xl font-bold mb-2 text-foreground">Latest from Madhya Pradesh</h2>
        <p className="text-muted-foreground mb-8">All the latest news from across the state.</p>
        <EmptyState message="No news articles yet." />
      </div>
    )
  }

  const featured = news[0]
  const rest = news.slice(1)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="font-serif text-3xl font-bold mb-2 text-foreground">Latest from Madhya Pradesh</h2>
      <p className="text-muted-foreground mb-8">All the latest news from across the state.</p>

      {/* Featured Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <NewsCard item={featured} featured />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {rest.slice(0, 4).map(item => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* More news grid */}
      {rest.length > 4 && (
        <section>
          <h3 className="font-serif text-2xl font-bold mb-6 text-foreground">More Stories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.slice(4).map(item => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
