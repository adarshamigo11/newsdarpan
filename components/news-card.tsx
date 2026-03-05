import Link from 'next/link'
import { timeAgo, formatDate } from '@/lib/time-ago'
import type { NewsItem } from '@/lib/news-store'

export function NewsCard({ item, featured = false }: { item: NewsItem; featured?: boolean }) {
  return (
    <Link href={`/news/${item.id}`} className="group block">
      <article
        className={`relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
          featured ? 'h-[400px] md:h-[500px]' : 'h-[280px]'
        }`}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/80 to-foreground" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-5">
          {item.isLive && (
            <span className="absolute top-4 left-4 flex items-center gap-1.5 bg-primary text-primary-foreground px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" />
              Live
            </span>
          )}
          <span className="text-xs text-white/60 mb-1">{item.city}</span>
          <h3 className={`font-serif font-bold text-white leading-tight mb-2 group-hover:text-primary transition-colors ${featured ? 'text-xl md:text-2xl' : 'text-base md:text-lg'}`}>
            {item.title}
          </h3>
          <p className="text-white/70 text-sm line-clamp-2 mb-3 hidden sm:block">{item.description}</p>
          <div className="flex items-center gap-3 text-xs text-white/50">
            <span>{item.author}</span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span>{timeAgo(item.createdAt)}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export function NewsCardSmall({ item }: { item: NewsItem }) {
  return (
    <Link href={`/news/${item.id}`} className="group flex gap-3 items-start">
      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
          crossOrigin="anonymous"
        />
      )}
      <div className="flex-1 min-w-0">
        <h4 className="font-serif text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {item.title}
        </h4>
        <span className="text-xs text-muted-foreground mt-1 block">{timeAgo(item.createdAt)}</span>
      </div>
    </Link>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      </div>
      <p className="text-muted-foreground text-sm">{message}</p>
      <p className="text-muted-foreground/60 text-xs mt-1">The admin can add articles from the admin panel.</p>
    </div>
  )
}
