import { getNewsById, getNewsByCity, getRecentNews } from '@/lib/news-store'
import { timeAgo, formatDate } from '@/lib/time-ago'
import { NewsCardSmall } from '@/components/news-card'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null
  
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`
    }
  }
  
  return null
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await getNewsById(id)
  if (!item) return notFound()
  
  const youtubeEmbedUrl = getYouTubeEmbedUrl(item.youtubeLink)

  const related = (await getNewsByCity(item.city)).filter(n => n.id !== item.id).slice(0, 4)
  const recent = (await getRecentNews(4)).filter(n => n.id !== item.id).slice(0, 4)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Main Content */}
        <article className="flex-1 max-w-4xl">
          <div className="mb-4">
            <Link href={`/city/${item.city.toLowerCase()}`} className="text-xs uppercase tracking-wider text-primary font-semibold hover:underline">
              {item.city}
            </Link>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold leading-tight mb-4 text-foreground text-balance">
            {item.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
            <span className="font-medium text-foreground">{item.author}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>Published: {formatDate(item.createdAt)}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>{timeAgo(item.createdAt)}</span>
            {item.isLive && (
              <span className="flex items-center gap-1 bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-bold uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" />
                Live
              </span>
            )}
          </div>
          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              className="w-full rounded-xl mb-8 max-h-[500px] object-cover"
              crossOrigin="anonymous"
            />
          )}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-lg leading-relaxed text-muted-foreground mb-4">{item.description}</p>
            <div className="text-foreground leading-relaxed whitespace-pre-wrap">{item.content}</div>
          </div>
          {youtubeEmbedUrl && (
            <div className="mb-8">
              <h3 className="font-serif text-xl font-bold mb-3 text-foreground">Watch Video</h3>
              <div className="aspect-video rounded-xl overflow-hidden">
                <iframe
                  src={youtubeEmbedUrl}
                  title="YouTube Video"
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
          )}
          {/* Related News */}
          {related.length > 0 && (
            <section className="mt-10 pt-8 border-t border-border">
              <h3 className="font-serif text-xl font-bold mb-5 text-foreground">More from {item.city}</h3>
              <div className="flex flex-col gap-4">
                {related.map(n => (
                  <NewsCardSmall key={n.id} item={n} />
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Sidebar */}
        <aside className="lg:w-80 flex-shrink-0">
          <div className="sticky top-32 rounded-xl border border-border p-5 bg-card">
            <h3 className="font-serif text-lg font-bold mb-4 text-foreground">Recent Headlines</h3>
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent news.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {recent.map(n => (
                  <NewsCardSmall key={n.id} item={n} />
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
