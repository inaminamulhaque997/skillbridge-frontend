export interface Review {
  id: string
  studentName: string
  studentAvatar?: string
  studentInitials: string
  rating: number
  comment: string
  date: string
  subject: string
}

export interface SubjectExpertise {
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface DayAvailability {
  date: string
  day: string
  dayOfWeek: string
  slots: TimeSlot[]
}

export interface TutorProfile {
  id: string
  name: string
  avatar?: string
  initials: string
  title: string
  subjects: string[]
  rating: number
  totalReviews: number
  studentsTaught: number
  responseTime: string
  bio: string
  fullBio: string
  verified: boolean
  memberSince: string
  lastActive: string
  avgResponseTime: string
  hourlyRate: number
  videoIntroUrl?: string
  subjectExpertise: SubjectExpertise[]
  availability: DayAvailability[]
  reviews: Review[]
  languages: string[]
  education: string
  certifications: string[]
}

export const sampleTutorProfile: TutorProfile = {
  id: '1',
  name: 'Sarah Chen',
  initials: 'SC',
  title: 'Senior Software Engineer & Full-Stack Developer',
  subjects: ['Programming', 'JavaScript', 'React', 'Node.js', 'TypeScript'],
  rating: 4.9,
  totalReviews: 127,
  studentsTaught: 340,
  responseTime: '< 2 hours',
  bio: 'Senior software engineer with 8 years of experience in web development. Specialized in JavaScript, React, and modern web technologies.',
  fullBio: `Hello! I'm Sarah, a passionate software engineer with over 8 years of experience building scalable web applications. I specialize in modern JavaScript frameworks, particularly React and Node.js, and I love helping students master these technologies.

My teaching philosophy centers on hands-on learning and real-world applications. I believe the best way to learn programming is by building actual projects, so I structure my sessions around practical examples and real-world scenarios you'll encounter in your career.

I've worked with companies ranging from early-stage startups to Fortune 500 companies, giving me a unique perspective on what skills are most valuable in the industry. Whether you're just starting your coding journey or looking to level up your skills for a career transition, I'm here to help you succeed.

In our sessions, I focus on not just teaching syntax, but helping you understand the underlying concepts and best practices that will make you a better developer. I'm patient, encouraging, and committed to your success.`,
  verified: true,
  memberSince: 'January 2022',
  lastActive: '2 hours ago',
  avgResponseTime: '< 2 hours',
  hourlyRate: 85,
  videoIntroUrl: undefined,
  languages: ['English', 'Mandarin'],
  education: 'BS Computer Science - Stanford University',
  certifications: [
    'AWS Certified Solutions Architect',
    'React Advanced Certification',
    'Full-Stack Web Development Nanodegree',
  ],
  subjectExpertise: [
    { name: 'JavaScript', level: 'Advanced' },
    { name: 'React', level: 'Advanced' },
    { name: 'Node.js', level: 'Advanced' },
    { name: 'TypeScript', level: 'Advanced' },
    { name: 'Next.js', level: 'Intermediate' },
    { name: 'Python', level: 'Intermediate' },
    { name: 'HTML/CSS', level: 'Advanced' },
    { name: 'Git & GitHub', level: 'Advanced' },
  ],
  availability: [
    {
      date: '2024-01-22',
      day: '22',
      dayOfWeek: 'Mon',
      slots: [
        { time: '09:00 AM', available: false },
        { time: '10:00 AM', available: true },
        { time: '11:00 AM', available: true },
        { time: '02:00 PM', available: true },
        { time: '03:00 PM', available: false },
        { time: '04:00 PM', available: true },
      ],
    },
    {
      date: '2024-01-23',
      day: '23',
      dayOfWeek: 'Tue',
      slots: [
        { time: '09:00 AM', available: true },
        { time: '10:00 AM', available: true },
        { time: '11:00 AM', available: false },
        { time: '02:00 PM', available: true },
        { time: '03:00 PM', available: true },
        { time: '04:00 PM', available: true },
      ],
    },
    {
      date: '2024-01-24',
      day: '24',
      dayOfWeek: 'Wed',
      slots: [
        { time: '09:00 AM', available: true },
        { time: '10:00 AM', available: false },
        { time: '11:00 AM', available: true },
        { time: '02:00 PM', available: true },
        { time: '03:00 PM', available: true },
        { time: '04:00 PM', available: false },
      ],
    },
    {
      date: '2024-01-25',
      day: '25',
      dayOfWeek: 'Thu',
      slots: [
        { time: '09:00 AM', available: true },
        { time: '10:00 AM', available: true },
        { time: '11:00 AM', available: true },
        { time: '02:00 PM', available: false },
        { time: '03:00 PM', available: true },
        { time: '04:00 PM', available: true },
      ],
    },
    {
      date: '2024-01-26',
      day: '26',
      dayOfWeek: 'Fri',
      slots: [
        { time: '09:00 AM', available: false },
        { time: '10:00 AM', available: true },
        { time: '11:00 AM', available: true },
        { time: '02:00 PM', available: true },
        { time: '03:00 PM', available: false },
        { time: '04:00 PM', available: false },
      ],
    },
    {
      date: '2024-01-27',
      day: '27',
      dayOfWeek: 'Sat',
      slots: [
        { time: '09:00 AM', available: true },
        { time: '10:00 AM', available: true },
        { time: '11:00 AM', available: false },
        { time: '02:00 PM', available: false },
        { time: '03:00 PM', available: false },
        { time: '04:00 PM', available: false },
      ],
    },
    {
      date: '2024-01-28',
      day: '28',
      dayOfWeek: 'Sun',
      slots: [
        { time: '09:00 AM', available: false },
        { time: '10:00 AM', available: false },
        { time: '11:00 AM', available: false },
        { time: '02:00 PM', available: false },
        { time: '03:00 PM', available: false },
        { time: '04:00 PM', available: false },
      ],
    },
  ],
  reviews: [
    {
      id: '1',
      studentName: 'Michael Johnson',
      studentInitials: 'MJ',
      rating: 5,
      comment:
        'Sarah is an exceptional tutor! She helped me land my first web developer job. Her teaching style is clear, patient, and she really knows how to break down complex concepts. Highly recommend!',
      date: '2024-01-15',
      subject: 'React',
    },
    {
      id: '2',
      studentName: 'Emily Rodriguez',
      studentInitials: 'ER',
      rating: 5,
      comment:
        'Best programming tutor I\'ve worked with. Sarah doesn\'t just teach you to code, she teaches you to think like a developer. Her real-world examples are incredibly valuable.',
      date: '2024-01-10',
      subject: 'JavaScript',
    },
    {
      id: '3',
      studentName: 'David Kim',
      studentInitials: 'DK',
      rating: 5,
      comment:
        'Very knowledgeable and patient. Sarah helped me understand React hooks and state management in a way that finally made sense. Great at adapting to different learning styles.',
      date: '2024-01-05',
      subject: 'React',
    },
    {
      id: '4',
      studentName: 'Lisa Anderson',
      studentInitials: 'LA',
      rating: 4,
      comment:
        'Sarah is great! She helped me build my first full-stack application from scratch. The only reason I\'m not giving 5 stars is that sometimes the sessions felt a bit rushed, but overall excellent experience.',
      date: '2023-12-28',
      subject: 'Node.js',
    },
    {
      id: '5',
      studentName: 'James Wilson',
      studentInitials: 'JW',
      rating: 5,
      comment:
        'Incredible tutor with deep knowledge of modern web development. Sarah helped me transition from backend to full-stack development. Her guidance was invaluable!',
      date: '2023-12-20',
      subject: 'Full-Stack Development',
    },
    {
      id: '6',
      studentName: 'Sophie Martinez',
      studentInitials: 'SM',
      rating: 5,
      comment:
        'I was struggling with TypeScript and Sarah made it so much easier to understand. Her explanations are clear and she provides great resources for further learning.',
      date: '2023-12-15',
      subject: 'TypeScript',
    },
    {
      id: '7',
      studentName: 'Ryan Brown',
      studentInitials: 'RB',
      rating: 5,
      comment:
        'Sarah is not only technically brilliant but also a fantastic teacher. She helped me prepare for technical interviews and I aced them! Thank you Sarah!',
      date: '2023-12-08',
      subject: 'Interview Prep',
    },
    {
      id: '8',
      studentName: 'Amanda Lee',
      studentInitials: 'AL',
      rating: 4,
      comment:
        'Very helpful and knowledgeable. Sarah helped me understand React component architecture much better. Would definitely recommend her to anyone learning web development.',
      date: '2023-12-01',
      subject: 'React',
    },
  ],
}
