import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Star, 
  Code, 
  Palette, 
  Calculator, 
  Microscope, 
  Briefcase, 
  Languages,
  Music,
  Camera,
  ChevronRight,
  CheckCircle2
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
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 p-2 bg-background rounded-lg shadow-lg border">
                <div className="flex-1 flex items-center gap-2 px-3">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="What do you want to learn?" 
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <select className="px-4 py-2 border-0 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary rounded">
                  <option>All Categories</option>
                  <option>Programming</option>
                  <option>Design</option>
                  <option>Business</option>
                  <option>Mathematics</option>
                  <option>Languages</option>
                </select>
                <Button size="lg" className="sm:w-auto">
                  Search
                </Button>
              </div>
            </div>

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
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Top-Rated Tutors
            </h2>
            <p className="text-lg text-muted-foreground">
              Learn from the best educators in their fields
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTutors.map((tutor) => (
              <Card 
                key={tutor.name} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-20 w-20 border-4 border-primary/10">
                      <AvatarImage src={tutor.image} alt={tutor.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                        {tutor.initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-xl">{tutor.name}</CardTitle>
                  <CardDescription className="text-base font-medium text-primary">
                    {tutor.subject}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{tutor.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({tutor.reviews} reviews)
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-foreground">${tutor.rate}</span>
                    <span className="text-muted-foreground">/hour</span>
                  </div>
                  <Button className="w-full group-hover:bg-primary/90 transition-colors">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
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
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Get started in three simple steps
            </p>
          </div>

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
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore subjects taught by expert tutors
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 max-w-5xl mx-auto">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Card 
                  key={category.name}
                  className="group cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="flex justify-center">
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="h-7 w-7 text-primary group-hover:text-primary-foreground" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">
                      {category.name}
                    </h3>
                    <Badge variant="secondary" className="font-normal">
                      {category.count} tutors
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/browse">
              <Button variant="outline" size="lg" className="group">
                Explore All Categories
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      </section>
    </div>
  )
}
