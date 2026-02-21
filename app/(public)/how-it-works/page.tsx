export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">How SkillBridge Works</h1>
      <div className="grid md:grid-cols-3 gap-8 mt-8">
        <div className="p-6 border rounded-lg">
          <div className="text-3xl font-bold text-primary mb-4">1</div>
          <h2 className="text-xl font-semibold mb-2">Browse Tutors</h2>
          <p className="text-muted-foreground">Search and filter tutors by subject, price, and availability.</p>
        </div>
        <div className="p-6 border rounded-lg">
          <div className="text-3xl font-bold text-primary mb-4">2</div>
          <h2 className="text-xl font-semibold mb-2">Book a Session</h2>
          <p className="text-muted-foreground">Select a time slot and book your tutoring session.</p>
        </div>
        <div className="p-6 border rounded-lg">
          <div className="text-3xl font-bold text-primary mb-4">3</div>
          <h2 className="text-xl font-semibold mb-2">Start Learning</h2>
          <p className="text-muted-foreground">Connect with your tutor and begin your learning journey.</p>
        </div>
      </div>
    </div>
  )
}