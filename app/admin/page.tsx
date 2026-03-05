'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MP_CITIES } from '@/lib/cities'

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [city, setCity] = useState<string>(MP_CITIES[0])
  const [image, setImage] = useState('')
  const [youtubeLink, setYoutubeLink] = useState('')
  const [isLive, setIsLive] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn')
    if (isLoggedIn === 'true') {
      setLoggedIn(true)
    }
  }, [])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (username === 'adminnews' && password === 'admin@2026') {
      setLoggedIn(true)
      sessionStorage.setItem('adminLoggedIn', 'true')
      setLoginError('')
    } else {
      setLoginError('Invalid credentials.')
    }
  }

  function handleLogout() {
    setLoggedIn(false)
    sessionStorage.removeItem('adminLoggedIn')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !description || !author || !city) {
      setMessage('Please fill in all required fields.')
      return
    }
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, content, author, city, image, youtubeLink, isLive }),
      })
      if (res.ok) {
        setMessage('News published successfully!')
        setTitle(''); setDescription(''); setContent(''); setAuthor('')
        setImage(''); setYoutubeLink(''); setIsLive(false)
      } else {
        setMessage('Failed to publish. Try again.')
      }
    } catch {
      setMessage('Network error.')
    }
    setSaving(false)
  }

  if (!loggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-2xl font-bold mb-6 text-center text-foreground">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4 rounded-xl border border-border p-6 bg-card">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground" htmlFor="admin-user">Username</label>
              <input id="admin-user" type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground" htmlFor="admin-pass">Password</label>
              <input id="admin-pass" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background text-foreground" />
            </div>
            {loginError && <p className="text-sm text-destructive">{loginError}</p>}
            <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors">
              Log In
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">Admin Panel</h1>
        <div className="flex items-center gap-4">
          <Link href="/admin/old-news" className="text-sm text-primary hover:underline">
            Manage Old News &rarr;
          </Link>
          <button onClick={handleLogout} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Log out
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border p-6 bg-card">
        <h2 className="font-serif text-xl font-bold text-foreground">Add News Article</h2>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">Title *</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background text-foreground" placeholder="Article headline" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">City *</label>
          <select value={city} onChange={e => setCity(e.target.value)} className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background text-foreground">
            {MP_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">Description *</label>
          <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background text-foreground resize-none" placeholder="Short summary" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">Full Content</label>
          <textarea rows={6} value={content} onChange={e => setContent(e.target.value)} className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background text-foreground resize-none" placeholder="Full article content..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">Author *</label>
          <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background text-foreground" placeholder="Author name" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">Image URL</label>
          <input type="text" value={image} onChange={e => setImage(e.target.value)} className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background text-foreground" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">YouTube Link</label>
          <input type="text" value={youtubeLink} onChange={e => setYoutubeLink(e.target.value)} className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background text-foreground" placeholder="https://youtube.com/watch?v=..." />
        </div>
        <div className="flex items-center gap-3">
          <input id="isLive" type="checkbox" checked={isLive} onChange={e => setIsLive(e.target.checked)} className="h-4 w-4 rounded border-input text-primary accent-primary" />
          <label htmlFor="isLive" className="text-sm font-medium text-foreground">Mark as LIVE</label>
        </div>
        {message && <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-destructive'}`}>{message}</p>}
        <button type="submit" disabled={saving} className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
          {saving ? 'Publishing...' : 'Publish Article'}
        </button>
      </form>
    </div>
  )
}
