import Link from 'next/link'
import Image from 'next/image'
import { getRecentNews } from '@/lib/news-store'
import { timeAgo } from '@/lib/time-ago'
import { MP_CITIES } from '@/lib/cities'

const NAV_CITIES = MP_CITIES.slice(0, 6)

export async function SiteFooter() {
  const recent = await getRecentNews(4)

  return (
    <footer className="bg-white/80 backdrop-blur-xl border-t border-border dark:bg-[#0a0a0a] dark:border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo */}
          <div>
            <Link href="/" className="inline-block mb-3">
              <Image 
                src="/logo.png" 
                alt="News Darpan Logo" 
                width={280} 
                height={80} 
                className="h-20 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-foreground/60 dark:text-white/60 leading-relaxed">
              Your trusted source for premium news coverage across Madhya Pradesh.
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-foreground dark:text-white">Quick Links</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="/about" className="text-sm text-foreground/60 dark:text-white/60 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-foreground/60 dark:text-white/60 hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/social" className="text-sm text-foreground/60 dark:text-white/60 hover:text-primary transition-colors">Social Media</Link></li>
            </ul>
          </div>
          {/* City Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-foreground dark:text-white">Cities</h3>
            <ul className="flex flex-col gap-2">
              {NAV_CITIES.map(city => (
                <li key={city}>
                  <Link href={`/city/${city.toLowerCase()}`} className="text-sm text-foreground/60 dark:text-white/60 hover:text-primary transition-colors">
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Recent News */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-foreground dark:text-white">Recent Headlines</h3>
            {recent.length === 0 ? (
              <p className="text-sm text-foreground/60 dark:text-white/60">No news yet. Admin can add articles.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {recent.map(n => (
                  <li key={n.id}>
                    <Link href={`/news/${n.id}`} className="text-sm text-foreground/60 dark:text-white/60 hover:text-primary transition-colors line-clamp-1">
                      {n.title}
                    </Link>
                    <span className="block text-xs text-foreground/40 dark:text-white/40">{timeAgo(n.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-foreground/10 dark:border-white/10 text-center">
          <p className="text-xs text-foreground/40 dark:text-white/40">News Darpan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
