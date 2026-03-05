import { MapPin, Mail, Phone, Clock } from 'lucide-react'

export default function ContactPage() {
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
              <p className="text-muted-foreground text-sm leading-relaxed">MP News Portal Office<br />Press Complex, Zone-1<br />Maharana Pratap Nagar<br />Bhopal, Madhya Pradesh 462011</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 flex-shrink-0">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Email</h3>
              <p className="text-muted-foreground text-sm">editor@mpnewsportal.com<br />info@mpnewsportal.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 flex-shrink-0">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Phone</h3>
              <p className="text-muted-foreground text-sm">+91 755 123 4567<br />+91 731 987 6543</p>
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
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground" htmlFor="name">Name</label>
              <input id="name" type="text" className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background text-foreground" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground" htmlFor="email">Email</label>
              <input id="email" type="email" className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background text-foreground" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground" htmlFor="message">Message</label>
              <textarea id="message" rows={4} className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background text-foreground resize-none" placeholder="Your message..." />
            </div>
            <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
