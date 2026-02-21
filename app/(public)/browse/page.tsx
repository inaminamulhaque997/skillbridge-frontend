'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { TutorCardEnhanced } from '@/components/tutor-card-enhanced'
import { mockTutors } from '@/data/mock-tutors'
import { getTutors, Tutor } from '@/services/tutor'
import { Search, SlidersHorizontal, X } from 'lucide-react'

type SortOption = 'rating' | 'price-low' | 'price-high' | 'newest'

export default function BrowseTutorsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([10, 200])
  const [minRating, setMinRating] = useState<number | null>(null)
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('rating')
  const [showFilters, setShowFilters] = useState(false)
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch tutors from API on mount
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const data = await getTutors()
        setTutors(data)
      } catch (error) {
        console.error('[SkillBridge] Error fetching tutors:', error)
        // Fall back to mock data
        setTutors(mockTutors)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTutors()
  }, [])

  // Extract unique subjects from all tutors
  const allSubjects = useMemo(() => {
    const subjects = new Set<string>()
    tutors.forEach((tutor) => {
      tutor.subjects.forEach((subject) => subjects.add(subject))
    })
    return Array.from(subjects).sort()
  }, [tutors])

  // Filter and sort tutors
  const filteredTutors = useMemo(() => {
    let filtered = tutors.filter((tutor) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = tutor.name.toLowerCase().includes(query)
        const matchesSubject = tutor.subjects.some((s) => s.toLowerCase().includes(query))
        const matchesBio = tutor.bio.toLowerCase().includes(query)
        if (!matchesName && !matchesSubject && !matchesBio) return false
      }

      // Subject filter
      if (selectedSubjects.length > 0) {
        const hasSubject = selectedSubjects.some((subject) =>
          tutor.subjects.includes(subject)
        )
        if (!hasSubject) return false
      }

      // Price range filter
      if (tutor.hourlyRate < priceRange[0] || tutor.hourlyRate > priceRange[1]) {
        return false
      }

      // Rating filter
      if (minRating && tutor.rating < minRating) {
        return false
      }

      // Availability filter
      if (selectedAvailability.length > 0) {
        const hasAvailability = selectedAvailability.some((availability) =>
          tutor.availability.includes(availability)
        )
        if (!hasAvailability) return false
      }

      return true
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'price-low':
          return a.hourlyRate - b.hourlyRate
        case 'price-high':
          return b.hourlyRate - a.hourlyRate
        case 'newest':
          return 0 // In real app, would sort by created date
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedSubjects, priceRange, minRating, selectedAvailability, sortBy])

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    )
  }

  const handleAvailabilityToggle = (availability: string) => {
    setSelectedAvailability((prev) =>
      prev.includes(availability)
        ? prev.filter((a) => a !== availability)
        : [...prev, availability]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedSubjects([])
    setPriceRange([10, 200])
    setMinRating(null)
    setSelectedAvailability([])
  }

  const hasActiveFilters =
    searchQuery ||
    selectedSubjects.length > 0 ||
    priceRange[0] !== 10 ||
    priceRange[1] !== 200 ||
    minRating !== null ||
    selectedAvailability.length > 0

  return (
    <div className="min-h-screen bg-secondary/30 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Browse Tutors</h1>
          <p className="text-lg text-muted-foreground">
            Find the perfect tutor to help you achieve your learning goals
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by subject, name, or keyword..."
              className="pl-10 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80 flex-shrink-0`}>
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5" />
                    Filters
                  </h2>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-primary"
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                {/* Subject Categories */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Subjects</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {allSubjects.map((subject) => (
                      <div key={subject} className="flex items-center space-x-2">
                        <Checkbox
                          id={`subject-${subject}`}
                          checked={selectedSubjects.includes(subject)}
                          onCheckedChange={() => handleSubjectToggle(subject)}
                        />
                        <label
                          htmlFor={`subject-${subject}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {subject}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}/hr
                  </Label>
                  <Slider
                    min={10}
                    max={200}
                    step={5}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mt-2"
                  />
                </div>

                {/* Rating Filter */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Minimum Rating</Label>
                  <div className="space-y-2">
                    {[4.5, 4, 3.5].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox
                          id={`rating-${rating}`}
                          checked={minRating === rating}
                          onCheckedChange={(checked) =>
                            setMinRating(checked ? rating : null)
                          }
                        />
                        <label
                          htmlFor={`rating-${rating}`}
                          className="text-sm cursor-pointer"
                        >
                          {rating}+ stars
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Availability</Label>
                  <div className="space-y-2">
                    {[
                      { value: 'today', label: 'Available Today' },
                      { value: 'week', label: 'This Week' },
                      { value: 'weekend', label: 'Weekend' },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`availability-${option.value}`}
                          checked={selectedAvailability.includes(option.value)}
                          onCheckedChange={() => handleAvailabilityToggle(option.value)}
                        />
                        <label
                          htmlFor={`availability-${option.value}`}
                          className="text-sm cursor-pointer"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              className="lg:hidden mb-4 w-full"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <p className="text-sm text-muted-foreground">
                {isLoading ? 'Loading tutors...' : `Showing ${filteredTutors.length} of ${tutors.length} tutors`}
              </p>
              <div className="flex items-center gap-2">
                <Label htmlFor="sort" className="text-sm whitespace-nowrap">
                  Sort by:
                </Label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="rating">Highest Rating</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Tutors Grid */}
            {filteredTutors.length > 0 ? (
              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-2">
                {filteredTutors.map((tutor) => (
                  <TutorCardEnhanced
                    key={tutor.id}
                    id={tutor.id}
                    name={tutor.name}
                    avatar={tutor.avatar}
                    initials={tutor.initials}
                    subjects={tutor.subjects}
                    rating={tutor.rating}
                    reviews={tutor.reviews}
                    hourlyRate={tutor.hourlyRate}
                    bio={tutor.bio}
                    verified={tutor.verified}
                  />
                ))}
              </div>
            ) : (
              // Empty State
              <Card className="p-12">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">No tutors found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    We couldn't find any tutors matching your criteria. Try adjusting your
                    filters or search terms.
                  </p>
                  {hasActiveFilters && (
                    <Button onClick={clearFilters} variant="outline">
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
