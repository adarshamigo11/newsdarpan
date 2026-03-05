'use client'

import { useState } from 'react'
import { MapPin, Mail, Phone, Clock } from 'lucide-react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !message) {
      setSubmitMessage('Please fill in all fields.')
      return
    }

    setSubmitting(true)
    setSubmitMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })

      if (res.ok) {
        setSubmitMessage('Message sent successfully!')
        setName('')
        setEmail('')
        setMessage('')
      } else {
        setSubmitMessage('Failed to send message. Please try again.')
      }
    } catch {
      setSubmitMessage('Network error. Please try again.')
    }

    setSubmitting(false)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8 text-foreground">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 flex-shrink-0">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Address</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Indore (M.P.)</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 flex-shrink-0">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Email</h3>
              <p className="text-muted-foreground text-sm">-</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 flex-shrink-0">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Phone</h3>
              <p className="text-muted-foreground text-sm">-</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 flex-shrink-0">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Working Hours</h3>
              <p className="text-muted-foreground text-sm">Monday - Saturday: 9:00 AM - 8:00 PM<br />Sunday: 10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card">
          <h2 className="font-serif text-xl font-bold mb-4 text-foreground">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground" htmlFor="name">Name</label>
              <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background text-foreground" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground" htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background text-foreground" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground" htmlFor="message">Message</label>
              <textarea id="message" rows={4} value={message} onChange={e => setMessage(e.target.value)} className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background text-foreground resize-none" placeholder="Your message..." />
            </div>
            {submitMessage && (
              <p className={`text-sm ${submitMessage.includes('success') ? 'text-green-600' : 'text-destructive'}`}>
                {submitMessage}
              </p>
            )}
            <button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
