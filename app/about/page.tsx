export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8 text-foreground">About Us</h1>
      <div className="space-y-8 text-foreground leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl font-bold mb-3 text-foreground">Company Overview</h2>
          <p className="text-muted-foreground leading-relaxed">
            MP News Portal is Madhya Pradesh{"'"}s leading digital news platform, delivering real-time, accurate, and comprehensive coverage of events across all major cities including Indore, Bhopal, Jabalpur, Gwalior, Ujjain, and more. Founded with a commitment to responsible journalism, we strive to keep our readers informed with premium quality reporting.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold mb-3 text-foreground">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            To provide timely, unbiased, and insightful news coverage that empowers the citizens of Madhya Pradesh to make informed decisions. We believe in the power of quality journalism to drive positive change in society.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold mb-3 text-foreground">Our Vision</h2>
          <p className="text-muted-foreground leading-relaxed">
            To become the most trusted and widely-read digital news source in Central India, setting new standards for online journalism with innovative technology and unwavering editorial integrity.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold mb-3 text-foreground">Leadership</h2>
          <div className="rounded-xl border border-border p-6 bg-card">
            <h3 className="font-serif text-xl font-semibold text-foreground">Editorial Board</h3>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              Our editorial team comprises experienced journalists and editors with decades of combined experience in print and digital media. Each member brings expertise in covering politics, business, sports, culture, and social issues across Madhya Pradesh.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
