'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export interface SearchBarProps {
  placeholder?: string
  categories?: string[]
  onSearch?: (query: string, category: string) => void
  className?: string
}

export function SearchBar({
  placeholder = 'What do you want to learn?',
  categories = [
    'All Categories',
    'Programming',
    'Design',
    'Business',
    'Mathematics',
    'Languages',
    'Science',
  ],
  onSearch,
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(categories[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(query, category)
    }
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`max-w-2xl mx-auto ${className}`}
      role="search"
    >
      <div className="flex flex-col sm:flex-row gap-3 p-2 bg-background rounded-lg shadow-lg border">
        <div className="flex-1 flex items-center gap-2 px-3">
          <Search className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            aria-label="Search for tutors or subjects"
          />
        </div>
        <label htmlFor="category-select" className="sr-only">
          Filter by category
        </label>
        <select
          id="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border-0 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary rounded cursor-pointer"
          aria-label="Select category"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <Button 
          type="submit" 
          size="lg" 
          className="sm:w-auto"
          aria-label="Search"
        >
          Search
        </Button>
      </div>
    </form>
  )
}
