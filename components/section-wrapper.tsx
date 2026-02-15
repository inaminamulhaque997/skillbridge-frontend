import { ReactNode } from 'react'

export interface SectionWrapperProps {
  children: ReactNode
  className?: string
  containerClassName?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  background?: 'default' | 'secondary' | 'muted'
  id?: string
}

const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  '3xl': 'max-w-7xl',
  '4xl': 'max-w-[1400px]',
  '5xl': 'max-w-[1600px]',
  full: 'max-w-full',
}

const paddingClasses = {
  none: '',
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-24',
  xl: 'py-20 md:py-32',
}

const backgroundClasses = {
  default: '',
  secondary: 'bg-secondary/30',
  muted: 'bg-muted/50',
}

export function SectionWrapper({
  children,
  className = '',
  containerClassName = '',
  maxWidth = '3xl',
  padding = 'lg',
  background = 'default',
  id,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`${paddingClasses[padding]} ${backgroundClasses[background]} ${className}`}
    >
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${containerClassName}`}>
        <div className={maxWidthClasses[maxWidth]}>{children}</div>
      </div>
    </section>
  )
}

export interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeader({ title, subtitle, className = '' }: SectionHeaderProps) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-muted-foreground text-balance">
          {subtitle}
        </p>
      )}
    </div>
  )
}
