'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MP_CITIES } from '@/lib/cities'
import { NewsItem } from '@/lib/news-store'

export default function OldNewsPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  
  // Edit form state
  const [editForm, setEditForm] = useState<Partial<NewsItem>>({})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

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

  async function fetchNews() {
    setLoading(true)
    try {
      const res = await fetch('/api/news')
      const data = await res.json()
      setNews(data)
    } catch {
      setMessage('Failed to load news')
    }
    setLoading(false)
  }

  useEffect(() => {
    if (loggedIn) {
      fetchNews()
    }
  }, [loggedIn])

  function startEditing(item: NewsItem) {
    setEditingId(item.id)
    setEditForm({ ...item })
    setMessage('')
  }

  function cancelEditing() {
    setEditingId(null)
    setEditForm({})
    setMessage('')
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!editingId) return
    
    setSaving(true)
    setMessage('')
    
    try {
      const res = await fetch(`/api/news/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      
      if (res.ok) {
        setMessage('News updated successfully!')
        setEditingId(null)
        setEditForm({})
        fetchNews()
      } else {
        setMessage('Failed to update news')
      }
    } catch {
      setMessage('Network error')
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this news article?')) return
    
    setDeleting(id)
    setMessage('')
    
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
      })
      
      if (res.ok) {
        setMessage('News deleted successfully!')
        fetchNews()
      } else {
        setMessage('Failed to delete news')
      }
    } catch {
      setMessage('Network error')
    }
    setDeleting(null)
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
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="font-serif text-3xl font-bold text-foreground">Manage Old News</h1>
          <Link href="/admin" className="text-sm text-primary hover:underline">
            &larr; Back to Admin
          </Link>
        </div>
        <button onClick={handleLogout} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Log out
        </button>
      </div>

      {message && (
        <p className={`text-sm mb-6 p-3 rounded-lg ${message.includes('success') ? 'text-green-700 bg-green-100' : 'text-destructive bg-destructive/10'}`}>
          {message}
        </p>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading news...</p>
      ) : news.length === 0 ? (
        <p className="text-muted-foreground">No news articles found.</p>
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id} className="rounded-xl border border-border p-5 bg-card">
              {editingId === item.id ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <h3 className="font-semibold text-foreground">Edit News Article</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">Title</label>
                    <input
                      type="text"
                      value={editForm.title || ''}
                      onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">City</label>
                    <select
                      value={editForm.city || ''}
                      onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                      className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background text-foreground"
                    >
                      {MP_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">Description</label>
                    <textarea
                      rows={2}
                      value={editForm.description || ''}
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background text-foreground resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">Full Content</label>
                    <textarea
                      rows={4}
                      value={editForm.content || ''}
                      onChange={e => setEditForm({ ...editForm, content: e.target.value })}
                      className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background text-foreground resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">Author</label>
                    <input
                      type="text"
                      value={editForm.author || ''}
                      onChange={e => setEditForm({ ...editForm, author: e.target.value })}
                      className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">Image URL</label>
                    <input
                      type="text"
                      value={editForm.image || ''}
                      onChange={e => setEditForm({ ...editForm, image: e.target.value })}
                      className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">YouTube Link</label>
                    <input
                      type="text"
                      value={editForm.youtubeLink || ''}
                      onChange={e => setEditForm({ ...editForm, youtubeLink: e.target.value })}
                      className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background text-foreground"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="isLive"
                      type="checkbox"
                      checked={editForm.isLive || false}
                      onChange={e => setEditForm({ ...editForm, isLive: e.target.checked })}
                      className="h-4 w-4 rounded border-input text-primary accent-primary"
                    />
                    <label htmlFor="isLive" className="text-sm font-medium text-foreground">Mark as LIVE</label>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="flex-1 bg-muted text-foreground py-2 rounded-lg font-medium text-sm hover:bg-muted/80 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      {item.isLive && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">LIVE</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>City: {item.city}</span>
                      <span>Author: {item.author}</span>
                      <span>Date: {new Date(item.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(item)}
                      className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      className="px-3 py-1.5 text-sm bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50"
                    >
                      {deleting === item.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
