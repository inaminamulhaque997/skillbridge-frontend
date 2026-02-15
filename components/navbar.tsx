'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, X, GraduationCap, User, LogOut, LayoutDashboard, Calendar, Settings, BookOpen, Clock } from 'lucide-react'
import { NotificationsDropdown } from '@/components/notifications-dropdown'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleLinks = () => {
    if (!user) return []

    switch (user.role) {
      case 'student':
        return [
          { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/dashboard/bookings', label: 'My Bookings', icon: Calendar },
          { href: '/dashboard/profile', label: 'Profile', icon: User },
        ]
      case 'tutor':
        return [
          { href: '/tutor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/tutor/sessions', label: 'Sessions', icon: BookOpen },
          { href: '/tutor/earnings', label: 'Earnings', icon: Calendar },
          { href: '/tutor/availability', label: 'Availability', icon: Clock },
          { href: '/tutor/profile', label: 'Profile', icon: User },
        ]
      case 'admin':
        return [
          { href: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
          { href: '/admin/users', label: 'Users', icon: User },
          { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
          { href: '/admin/settings', label: 'Settings', icon: Settings },
        ]
      default:
        return []
    }
  }

  return (
    <nav className="border-b bg-background sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">SkillBridge</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/browse" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Browse Tutors
            </Link>
            
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3 ml-4">
                {/* Notifications */}
                <NotificationsDropdown />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                      <Avatar className="h-9 w-9 border-2 border-primary/20">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        <p className="text-xs leading-none text-primary capitalize mt-1">{user.role}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {getRoleLinks().map((link) => {
                      const Icon = link.icon
                      return (
                        <DropdownMenuItem key={link.href} asChild>
                          <Link href={link.href} className="flex items-center cursor-pointer">
                            <Icon className="mr-2 h-4 w-4" />
                            <span>{link.label}</span>
                          </Link>
                        </DropdownMenuItem>
                      )
                    })}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md hover:bg-accent"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              href="/browse"
              className="block px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent"
              onClick={toggleMenu}
            >
              Browse Tutors
            </Link>

            {isAuthenticated && user ? (
              <>
                <div className="px-3 py-2 border-t mt-2">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>
                {getRoleLinks().map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent"
                      onClick={toggleMenu}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  )
                })}
                <button
                  onClick={() => {
                    logout()
                    toggleMenu()
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-3 pt-2 border-t">
                <Link href="/login" onClick={toggleMenu}>
                  <Button variant="ghost" size="sm" className="w-full">Login</Button>
                </Link>
                <Link href="/register" onClick={toggleMenu}>
                  <Button size="sm" className="w-full">Register</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
