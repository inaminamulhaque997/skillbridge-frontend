export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">About SkillBridge</h1>
      <p className="text-lg text-muted-foreground mb-8">
        SkillBridge is a platform connecting students with expert tutors worldwide. 
        We believe everyone deserves access to quality education.
      </p>
      <div className="prose prose-lg">
        <h2>Our Mission</h2>
        <p>To bridge the gap in education by connecting learners with qualified tutors.</p>
        <h2>Our Vision</h2>
        <p>A world where quality education is accessible to everyone, everywhere.</p>
      </div>
    </div>
  )
}