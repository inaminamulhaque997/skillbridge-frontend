# SkillBridge - Online Tutoring Platform

## Project Overview

SkillBridge is a full-stack online tutoring platform that connects students with tutors for personalized learning sessions. The platform supports three user roles: Students, Tutors, and Administrators, each with their own dashboard and functionality.

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI primitives)
- **State Management:** React Context API
- **Form Handling:** React Hook Form
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Notifications:** Sonner (Toast)
- **Date Handling:** Native JavaScript Date API

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** Zod
- **CORS:** cors middleware

---

## Project Structure

```
skillBridge/
├── skillbridge-backend/          # Backend API Server
│   ├── src/
│   │   ├── controllers/          # Request handlers
│   │   ├── services/             # Business logic
│   │   ├── routes/               # API routes
│   │   ├── middleware/           # Auth, validation, error handling
│   │   ├── validations/          # Zod schemas
│   │   ├── utils/                # Helper utilities
│   │   ├── config/               # Database & auth config
│   │   └── types/                # TypeScript types
│   └── prisma/
│       ├── schema.prisma         # Database schema
│       └── seed.ts               # Database seeding
│
└── skillbridge-frontend/         # Frontend Next.js App
    ├── app/                      # Next.js App Router
    │   ├── (public)/             # Public routes
    │   ├── (student)/            # Student protected routes
    │   ├── (tutor)/              # Tutor protected routes
    │   └── (admin)/              # Admin protected routes
    ├── components/               # React components
    │   ├── ui/                   # shadcn/ui components
    │   └── admin/                # Admin-specific components
    ├── services/                 # API service functions
    ├── contexts/                 # React contexts
    ├── types/                    # TypeScript types
    └── lib/                      # Utility functions
```

---

## User Roles & Authentication

### Roles
1. **Student** - Can browse tutors, book sessions, leave reviews
2. **Tutor** - Can manage availability, accept/reject bookings, view earnings
3. **Admin** - Can manage users, bookings, categories, view platform stats

### Authentication Flow
- JWT-based authentication with token stored in HTTP-only cookies
- Role-based access control (RBAC) for protected routes
- Middleware protection on both frontend and backend

---

## Routes

### Public Routes (`/`)
| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/browse` | Browse all tutors |
| `/tutors/[id]` | Tutor profile detail |
| `/login` | User login |
| `/register` | User registration |

### Student Routes (`/dashboard`)
| Route | Description |
|-------|-------------|
| `/dashboard` | Student dashboard with upcoming bookings |
| `/dashboard/bookings` | View all bookings (upcoming, completed, cancelled) |
| `/dashboard/profile` | Manage student profile |

### Tutor Routes (`/tutor`)
| Route | Description |
|-------|-------------|
| `/tutor/dashboard` | Tutor dashboard with stats and recent bookings |
| `/tutor/sessions` | Manage all tutoring sessions |
| `/tutor/earnings` | View earnings and payment history |
| `/tutor/availability` | Set weekly availability schedule |
| `/tutor/profile` | Manage tutor profile and subjects |

### Admin Routes (`/admin`)
| Route | Description |
|-------|-------------|
| `/admin` | Admin dashboard with platform statistics |
| `/admin/users` | Manage all platform users |
| `/admin/bookings` | View and manage all bookings |
| `/admin/categories` | Manage subject categories |

---

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login user |
| POST | `/logout` | Logout user |
| GET | `/me` | Get current user |
| PATCH | `/profile` | Update user profile |

### Tutors (`/api/tutors`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all tutors (with filters) |
| GET | `/:id` | Get tutor by ID |
| GET | `/featured` | Get featured tutors |
| GET | `/me/dashboard` | Get tutor dashboard data |
| GET | `/me/availability` | Get tutor availability |
| PATCH | `/me/availability` | Update availability |

### Bookings (`/api/bookings`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get user's bookings |
| GET | `/:id` | Get booking by ID |
| POST | `/` | Create new booking |
| PATCH | `/:id/status` | Update booking status |
| PATCH | `/:id/cancel` | Cancel booking |

### Reviews (`/api/reviews`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tutor/:tutorId` | Get tutor reviews |
| GET | `/booking/:bookingId` | Check if booking reviewed |
| POST | `/` | Submit review |

### Admin (`/api/admin`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats` | Get platform statistics |
| GET | `/users` | Get all users |
| PATCH | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |
| GET | `/categories` | Get all categories |
| POST | `/categories` | Add category |
| PATCH | `/categories/:id` | Update category |
| DELETE | `/categories/:id` | Delete category |

---

## Database Schema

### Models
- **User** - Base user model with role differentiation
- **TutorProfile** - Extended profile for tutors
- **StudentProfile** - Extended profile for students
- **Subject** - Subject categories
- **Availability** - Tutor weekly availability slots
- **Booking** - Session bookings
- **Review** - Student reviews for tutors

### Key Relationships
- User → TutorProfile (1:1)
- User → StudentProfile (1:1)
- TutorProfile → Subject (M:N)
- TutorProfile → Availability (1:N)
- User → Booking (as student or tutor)
- Booking → Review (1:1)

---

## Key Features

### For Students
- Browse and search tutors by subject, rating, price
- View detailed tutor profiles with reviews
- Book sessions based on tutor availability
- Manage upcoming and past bookings
- Leave reviews after completed sessions

### For Tutors
- Create and manage tutor profile
- Set hourly rates and subjects
- Define weekly availability schedule
- Accept/reject booking requests
- Track earnings and session history
- View student reviews

### For Administrators
- Platform statistics dashboard
- User management (view, ban, delete)
- Booking oversight and management
- Category management
- Monitor platform health

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/skillbridge"
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm or pnpm

### Backend Setup
```bash
cd skillbridge-backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Frontend Setup
```bash
cd skillbridge-frontend
npm install
npm run dev
```

### Test Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@skillbridge.com | admin123 |
| Tutor | tutor@skillbridge.com | tutor123 |
| Student | student@skillbridge.com | student123 |

---

## Recent Development Work

### Issues Fixed
1. **Routing Issues** - Fixed middleware and route group configurations for all user roles
2. **API Response Handling** - Fixed frontend services to correctly handle paginated backend responses
3. **React Hooks Violations** - Fixed hooks ordering issues in admin pages
4. **Null Safety** - Added proper null checks for API response data
5. **Async Data Fetching** - Converted synchronous state initialization to proper async patterns





## Future Enhancements
- Real-time chat between students and tutors
- Video conferencing integration
- Payment gateway integration
- Email notifications
- Mobile application
- Advanced analytics for tutors
- Multi-language support

---

## Contributors
- Development Team - Full Stack Development

---

## License
This project is developed for educational purposes as part of an assignment.