export default function FaqPage() {
  const faqs = [
    {
      question: "How do I book a tutoring session?",
      answer: "Browse tutors, select one that view their profile, choose an available time slot, and book. You'll receive a confirmation email."
    },
    {
      question: "How do I become a tutor?",
      answer: "Register as a tutor, complete your profile with your subjects, rates, and availability. Students can then find and book you."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers."
    },
    {
      question: "Can I cancel or reschedule a session?",
      answer: "Yes, you can cancel or reschedule up to 24 hours before your session for a full refund.",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-lg p-6">
            <h3 className="font-semibold mb-2">{faq.question}</h3>
            <p className="text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}