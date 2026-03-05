'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'

interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
  read: boolean
}

export default function ContactMessagesPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn')
    if (isLoggedIn === 'true') {
      setLoggedIn(true)
      fetchMessages()
    } else {
      setLoading(false)
    }
  }, [])

  async function fetchMessages() {
    try {
      const res = await fetch('/api/contact')
      const data = await res.json()
      setMessages(data.messages || [])
    } catch {
      setMessages([])
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this message?')) {
      return
    }

    setDeletingId(id)
    try {
      const res = await fetch(`/api/contact?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setMessages(messages.filter(m => m.id !== id))
      } else {
        alert('Failed to delete message')
      }
    } catch {
      alert('Network error')
    }
    setDeletingId(null)
  }

  function handleLogout() {
    sessionStorage.removeItem('adminLoggedIn')
    window.location.href = '/admin'
  }

  if (!loggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please login to access admin panel</p>
          <Link href="/admin" className="text-primary hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">Contact Messages</h1>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-sm text-primary hover:underline">
            &larr; Back to Admin
          </Link>
          <button onClick={handleLogout} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Log out
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading messages...</p>
      ) : messages.length === 0 ? (
        <div className="rounded-xl border border-border p-8 bg-card text-center">
          <p className="text-muted-foreground">No contact messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="rounded-xl border border-border p-6 bg-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{msg.name}</h3>
                  <p className="text-sm text-muted-foreground">{msg.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    disabled={deletingId === msg.id}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
