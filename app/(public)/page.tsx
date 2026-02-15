import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TutorCard } from '@/components/tutor-card'
import { CategoryBadge } from '@/components/category-badge'
import { SearchBar } from '@/components/search-bar'
import { SectionWrapper, SectionHeader } from '@/components/section-wrapper'
import { 
  Code, 
  Palette, 
  Calculator, 
  Microscope, 
  Briefcase, 
  Languages,
  Music,
  Camera,
  ChevronRight,
} from 'lucide-react'

export default function HomePage() {
  const featuredTutors = [
    {
      name: 'Sarah Chen',
      subject: 'Programming',
      rating: 4.9,
      reviews: 127,
      rate: 45,
      image: '/placeholder.svg?height=100&width=100',
      initials: 'SC',
    },
    {
      name: 'Michael Rodriguez',
      subject: 'Design',
      rating: 5.0,
      reviews: 89,
      rate: 40,
      image: '/placeholder.svg?height=100&width=100',
      initials: 'MR',
    },
    {
      name: 'Emily Watson',
      subject: 'Mathematics',
      rating: 4.8,
      reviews: 156,
      rate: 35,
      image: '/placeholder.svg?height=100&width=100',
      initials: 'EW',
    },
    {
      name: 'James Park',
      subject: 'Business',
      rating: 4.9,
      reviews: 94,
      rate: 50,
      image: '/placeholder.svg?height=100&width=100',
      initials: 'JP',
    },
  ]

  const categories = [
    { name: 'Programming', icon: Code, count: 234 },
    { name: 'Design', icon: Palette, count: 156 },
    { name: 'Mathematics', icon: Calculator, count: 189 },
    { name: 'Science', icon: Microscope, count: 143 },
    { name: 'Business', icon: Briefcase, count: 167 },
    { name: 'Languages', icon: Languages, count: 198 },
    { name: 'Music', icon: Music, count: 87 },
    { name: 'Photography', icon: Camera, count: 72 },
  ]

  const steps = [
    {
      number: '1',
      title: 'Browse',
      description: 'Search through hundreds of qualified tutors and find the perfect match for your learning goals.',
    },
    {
      number: '2',
      title: 'Book',
      description: 'Schedule a session at a time that works for you. Flexible timing with instant confirmation.',
    },
    {
      number: '3',
      title: 'Learn',
      description: 'Connect with your tutor and start learning. Track your progress and achieve your goals.',
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance text-foreground leading-tight">
                Connect with Expert Tutors, Learn Anything
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
                Find top-rated tutors in programming, design, business, and more
              </p>
            </div>

            {/* Search Bar */}
            <SearchBar />

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/browse">
                <Button size="lg" className="w-full sm:w-auto group">
                  Find a Tutor
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Become a Tutor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tutors Section */}
      <SectionWrapper padding="lg">
        <SectionHeader
          title="Top-Rated Tutors"
          subtitle="Learn from the best educators in their fields"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTutors.map((tutor) => (
            <TutorCard
              key={tutor.name}
              name={tutor.name}
              subject={tutor.subject}
              rating={tutor.rating}
              reviews={tutor.reviews}
              rate={tutor.rate}
              image={tutor.image}
              initials={tutor.initials}
              href={`/tutor/${tutor.name.toLowerCase().replace(' ', '-')}`}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/browse">
            <Button variant="outline" size="lg" className="group">
              View All Tutors
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </SectionWrapper>

      {/* How It Works Section */}
      <SectionWrapper padding="lg" background="secondary">
        <SectionHeader
          title="How It Works"
          subtitle="Get started in three simple steps"
          className="mb-16"
        />

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <Card className="h-full border-2 hover:border-primary transition-all duration-300 hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary-foreground">
                      {step.number}
                    </span>
                  </div>
                  <CardTitle className="text-2xl mb-2">{step.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardHeader>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                  <ChevronRight className="h-8 w-8 text-primary/40" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/register">
            <Button size="lg" className="group">
              Get Started Today
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </SectionWrapper>

      {/* Categories Section */}
      <SectionWrapper padding="lg">
        <SectionHeader
          title="Browse by Category"
          subtitle="Explore subjects taught by expert tutors"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 max-w-5xl mx-auto">
          {categories.map((category) => (
            <CategoryBadge
              key={category.name}
              name={category.name}
              icon={category.icon}
              count={category.count}
              href={`/browse?category=${category.name.toLowerCase()}`}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/browse">
            <Button variant="outline" size="lg" className="group">
              Explore All Categories
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper padding="md">
        <Card className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-none overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <CardContent className="relative p-8 md:p-16">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold text-balance">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
                Join thousands of students already learning with SkillBridge. Find your perfect tutor today and unlock your potential.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/browse">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto group">
                    Browse Tutors
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10">
                    Sign Up Free
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </SectionWrapper>
    </div>
  )
}
