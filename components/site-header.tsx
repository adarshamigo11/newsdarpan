'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Cloud, ChevronDown, Menu, X, RefreshCw } from 'lucide-react'
import { MP_CITIES } from '@/lib/cities'
import { ThemeToggle } from '@/components/theme-toggle'

const NAV_CITIES = MP_CITIES.slice(0, 6)

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
  
  return (
    <Link 
      href={href} 
      className={`flex items-center h-full px-4 text-base font-medium transition-colors ${
        isActive 
          ? 'bg-white text-primary' 
          : 'hover:bg-primary-foreground/10'
      }`}
    >
      {children}
    </Link>
  )
}

function WeatherWidget() {
  const [city, setCity] = useState('Indore')
  const [weather, setWeather] = useState({ temp: '--', description: 'Loading...' })
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const fetchWeather = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/weather/${city}?t=${Date.now()}`)
      const d = await res.json()
      setWeather({ temp: `${d.temp}°C`, description: d.description })
    } catch {
      setWeather({ temp: '--', description: 'Error' })
    } finally {
      setLoading(false)
    }
  }, [city])

  useEffect(() => {
    fetchWeather()
  }, [fetchWeather])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 hover:text-foreground transition-colors"
        >
          <Cloud className="h-4 w-4" />
          <span className="font-medium text-foreground">{city}</span>
          <span className="hidden sm:inline">| {weather.temp} | <span className="capitalize">{weather.description}</span></span>
          <ChevronDown className="h-3 w-3" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); fetchWeather() }}
          className="p-1 hover:bg-accent rounded disabled:opacity-50"
          disabled={loading}
          title="Refresh weather"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-44 rounded-lg border border-border bg-card shadow-xl">
          {MP_CITIES.map(c => (
            <button
              key={c}
              onClick={() => { setCity(c); setOpen(false) }}
              className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-accent first:rounded-t-lg last:rounded-b-lg ${c === city ? 'text-primary font-semibold bg-accent' : 'text-foreground'}`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
  
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`block px-3 py-2 text-sm rounded ${
        isActive 
          ? 'bg-primary text-white' 
          : 'hover:bg-accent'
      }`}
    >
      {children}
    </Link>
  )
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
      {/* Top bar */}
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3">
        <span className="text-xs text-muted-foreground hidden sm:block">{today}</span>
        <Link href="/" className="flex flex-col items-center">
          <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            MP <span className="text-primary">News</span> Portal
          </h1>
          <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Madhya Pradesh</span>
        </Link>
        <div className="hidden sm:flex items-center gap-2">
          <WeatherWidget />
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {/* Navigation */}
      <nav className="border-t border-border bg-primary/70 backdrop-blur-xl text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4">
          <ul className="hidden md:flex items-stretch h-14">
            <li><NavLink href="/">Home</NavLink></li>
            {NAV_CITIES.map(c => (
              <li key={c}><NavLink href={`/city/${c.toLowerCase()}`}>{c}</NavLink></li>
            ))}
            <li><NavLink href="/about">About</NavLink></li>
            <li><NavLink href="/contact">Contact</NavLink></li>
          </ul>
        </div>
      </nav>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card p-4">
          <div className="mb-3"><WeatherWidget /></div>
          <ul className="flex flex-col gap-1">
            <li><MobileNavLink href="/" onClick={() => setMobileOpen(false)}>Home</MobileNavLink></li>
            {NAV_CITIES.map(c => (
              <li key={c}><MobileNavLink href={`/city/${c.toLowerCase()}`} onClick={() => setMobileOpen(false)}>{c}</MobileNavLink></li>
            ))}
            <li><MobileNavLink href="/about" onClick={() => setMobileOpen(false)}>About</MobileNavLink></li>
            <li><MobileNavLink href="/contact" onClick={() => setMobileOpen(false)}>Contact</MobileNavLink></li>
          </ul>
        </div>
      )}
    </header>
  )
}
