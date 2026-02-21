# SkillBridge Frontend

A modern, responsive web application for the SkillBridge tutoring platform, built with Next.js 14, TypeScript, and Tailwind CSS.

## 🌐 Live Deployment

**Frontend:** https://skillbridge-frontend-mocha.vercel.app/  
**Backend API:** https://skillbridge-backend-sigma.vercel.app/

## 🚀 Features

### For Students
- 🔍 **Browse Tutors** - Search and filter tutors by subject, rating, and price
- 📅 **Book Sessions** - Schedule tutoring sessions with availability checking
- ⭐ **Leave Reviews** - Rate and review tutors after sessions
- 📊 **Dashboard** - Track bookings and session history

### For Tutors
- 👤 **Profile Management** - Create and update tutor profiles
- 📆 **Availability Settings** - Set weekly availability slots
- 💰 **Earnings Tracking** - Monitor income and session statistics
- 📝 **Session Management** - Accept, reject, or complete bookings

### For Admins
- 📈 **Platform Analytics** - View user statistics and revenue
- 👥 **User Management** - Activate/deactivate users
- 📂 **Category Management** - Manage subject categories
- 📋 **Booking Oversight** - Monitor all platform bookings

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** React Context
- **Form Handling:** React Hook Form
- **HTTP Client:** Native Fetch API
- **Deployment:** Vercel

## 📁 Project Structure

```
skillbridge-frontend/
├── app/
│   ├── (admin)/          # Admin dashboard routes
│   ├── (public)/         # Public pages (home, login, register)
│   ├── (student)/        # Student dashboard routes
│   └── (tutor)/          # Tutor dashboard routes
├── components/
│   ├── ui/               # shadcn/ui components
│   └── admin/            # Admin-specific components
├── contexts/
│   └── auth-context.tsx  # Authentication state
├── services/
│   ├── auth.ts           # Auth API calls
│   ├── booking.ts        # Booking API calls
│   └── tutor.ts          # Tutor API calls
├── types/
│   ├── auth.ts           # Auth types
│   └── booking.ts        # Booking types
└── lib/
    └── api-client.ts     # API client configuration
```

## 🎨 Pages Overview

### Public Pages
- `/` - Homepage
- `/browse` - Browse all tutors
- `/tutors/[id]` - Tutor profile details
- `/login` - User login
- `/register` - User registration
- `/about`, `/contact`, `/faq`, `/help` - Information pages

### Student Dashboard
- `/dashboard` - Student overview
- `/dashboard/bookings` - Booking history
- `/dashboard/profile` - Profile settings

### Tutor Dashboard
- `/tutor/dashboard` - Tutor overview
- `/tutor/sessions` - Session management
- `/tutor/earnings` - Earnings report
- `/tutor/availability` - Set availability
- `/tutor/profile` - Profile settings

### Admin Dashboard
- `/admin` - Platform statistics
- `/admin/users` - User management
- `/admin/bookings` - Booking oversight
- `/admin/categories` - Category management

## 🔧 Environment Variables

```env
NEXT_PUBLIC_API_URL="https://your-backend.vercel.app"
```

## 🏃‍♂️ Running Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔐 Authentication

The app uses JWT-based authentication with:
- HTTP-only cookies for session management
- localStorage for client-side auth state
- Protected routes with role-based access

## 📱 Responsive Design

- Mobile-first approach
- Responsive navigation with hamburger menu
- Optimized for all screen sizes

## 🎯 Key Features

- **Real-time Availability** - Check tutor availability before booking
- **Role-based Routing** - Automatic redirects based on user role
- **Toast Notifications** - User feedback for all actions
- **Loading States** - Smooth UX with loading indicators
- **Error Handling** - Graceful error messages and recovery

