export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">Help Center</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Find answers and get support for SkillBridge.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
          <p className="text-muted-foreground">Learn how to create an account and book your first session.</p>
        </div>
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">For Tutors</h2>
          <p className="text-muted-foreground">Set up your profile and start accepting students.</p>
        </div>
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Payments</h2>
          <p className="text-muted-foreground">Understand pricing, payments, and refunds.</p>
        </div>
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Technical Support</h2>
          <p className="text-muted-foreground">Having technical issues? We're here to help.</p>
        </div>
      </div>
    </div>
  )
}