# SkillBridge - Multi-Role Tutoring Platform

A professional tutoring platform built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui components.

## 🚀 Features

- **Multi-Role Authentication**: Support for Students, Tutors, and Admins
- **Responsive Design**: Mobile-first approach with a professional indigo color scheme
- **Route Groups**: Organized structure with separate route groups for different user roles
- **Modern UI**: Built with shadcn/ui components (Button, Card, Input, Badge, Avatar)
- **Professional Navigation**: Responsive navbar with mobile hamburger menu
- **Comprehensive Footer**: Social links, company info, and quick navigation

## 📁 Project Structure

```
app/
├── (public)/              # Public routes (no authentication required)
│   ├── page.tsx          # Landing page with hero, features, and CTA
│   ├── browse/           # Browse tutors page
│   ├── login/            # Login page
│   └── register/         # Registration page
├── (student)/            # Student dashboard routes
│   └── dashboard/        # Student dashboard with sessions and stats
├── (tutor)/              # Tutor routes
│   └── tutor/
│       └── dashboard/    # Tutor dashboard with earnings and schedule
├── (admin)/              # Admin routes
│   └── admin/
│       └── dashboard/    # Admin dashboard with platform analytics
├── globals.css           # Global styles with custom Tailwind theme
└── layout.tsx            # Root layout with Navbar and Footer

components/
├── navbar.tsx            # Responsive navigation component
├── footer.tsx            # Footer with links and social media
└── ui/                   # shadcn/ui components
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    ├── badge.tsx
    ├── avatar.tsx
    ├── label.tsx
    └── ...
```

## 🎨 Design System

### Color Scheme
- **Primary**: Indigo-600 (HSL: 238.7 83.5% 66.7%)
- **Secondary**: Slate-50 (HSL: 210 40% 98%)
- **Background**: White
- **Foreground**: Dark blue-gray

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, large sizes with proper hierarchy
- **Body Text**: Regular weight with relaxed line-height

### Components
All UI components are built with shadcn/ui and customized to match the professional indigo theme.

## 🛣️ Routes

### Public Routes
- `/` - Landing page with hero section, features, and popular subjects
- `/browse` - Browse available tutors with search functionality
- `/login` - User login page
- `/register` - User registration page

### Student Routes
- `/dashboard` - Student dashboard with upcoming sessions and learning stats

### Tutor Routes
- `/tutor/dashboard` - Tutor dashboard with earnings, schedule, and reviews

### Admin Routes
- `/admin/dashboard` - Admin dashboard with platform analytics and management tools

## 🚦 Getting Started

1. **Install Dependencies**
```bash
npm install
# or
pnpm install
```

2. **Run Development Server**
```bash
npm run dev
# or
pnpm dev
```

3. **Open Browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)

## 📱 Responsive Design

The entire platform is built with a mobile-first approach:
- Mobile: Single column layouts with hamburger menu
- Tablet: Two-column grids where appropriate
- Desktop: Multi-column layouts with enhanced spacing

## 🔐 Authentication (To Be Implemented)

The project structure is ready for authentication integration:
- Login and registration pages are in place
- Route groups are organized by user role
- Dashboard pages are role-specific

## 🎯 Next Steps

1. **Backend Integration**: Add database and API routes
2. **Authentication**: Implement user authentication with role-based access
3. **Session Management**: Build session booking and video call features
4. **Payment Integration**: Add payment processing for tutoring sessions
5. **Real-time Features**: Implement messaging and notifications
6. **Search & Filtering**: Add advanced tutor search with filters
7. **Profile Management**: Create user profile editing functionality
8. **Review System**: Build rating and review functionality

## 📄 License

MIT License - feel free to use this project for your own tutoring platform!
