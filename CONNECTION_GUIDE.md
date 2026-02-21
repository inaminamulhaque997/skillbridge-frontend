# SkillBridge Frontend-Backend Connection Guide

## Overview

This document describes the seamless connection established between the SkillBridge frontend (Next.js) and backend (Express.js + Prisma + NeonDB).

## Architecture

```
┌─────────────────┐     HTTP/Cookies      ┌─────────────────┐     Prisma     ┌─────────────────┐
│   Frontend      │ ◄──────────────────► │    Backend      │ ◄────────────► │    NeonDB       │
│   (Next.js)     │     Port 3000         │   (Express)     │                │   (PostgreSQL)  │
│                 │                       │   Port 5000     │                │                 │
└─────────────────┘                       └─────────────────┘                └─────────────────┘
```

## Authentication Flow

### HTTP-Only Cookie Based Authentication

1. **Login/Register**: Backend sets JWT as HTTP-only cookie
2. **Subsequent Requests**: Browser automatically sends cookie
3. **Middleware**: Validates token from cookie or Authorization header
4. **Logout**: Backend clears cookie

### Cookie Configuration

```typescript
// Backend sets cookie with these options
{
  httpOnly: true,           // Not accessible via JavaScript
  secure: production,       // HTTPS only in production
  sameSite: 'lax',         // CSRF protection
  maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days
  path: '/',
}
```

## API Endpoints

### Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/tutors` | List all tutors |
| GET | `/api/tutors/:id` | Get tutor by ID |
| GET | `/api/tutors/:id/availability` | Get tutor availability |
| GET | `/api/categories` | List all categories |
| GET | `/api/reviews/tutor/:tutorId` | Get tutor reviews |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Protected Endpoints (Auth Required)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/auth/me` | Any | Get current user |
| POST | `/api/auth/logout` | Any | Logout user |
| GET | `/api/bookings` | Student/Tutor | Get my bookings |
| POST | `/api/bookings` | Student | Create booking |
| PATCH | `/api/bookings/:id/cancel` | Student | Cancel booking |
| POST | `/api/reviews` | Student | Create review |
| GET | `/api/reviews/booking/:bookingId` | Student | Check review exists |
| GET | `/api/tutor/profile` | Tutor | Get my profile |
| PUT | `/api/tutor/profile` | Tutor | Update profile |
| GET | `/api/tutor/availability` | Tutor | Get my availability |
| PUT | `/api/tutor/availability` | Tutor | Update availability |
| GET | `/api/tutor/sessions` | Tutor | Get my sessions |
| GET | `/api/admin/*` | Admin | Admin endpoints |

## Frontend Services

### API Client (`lib/api-client.ts`)

Centralized HTTP client with:
- Automatic credential inclusion (`credentials: 'include'`)
- Authorization header fallback
- Error handling
- TypeScript support

### Service Files

| File | Purpose |
|------|---------|
| `services/auth.ts` | Authentication operations |
| `services/tutor.ts` | Public tutor operations |
| `services/tutor-dashboard.ts` | Tutor dashboard operations |
| `services/booking.ts` | Booking operations |
| `services/admin.ts` | Admin operations |
| `services/category.ts` | Category operations |

## Environment Configuration

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="30d"
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Running the Application

### Start Backend

```bash
cd skillbridge-backend
npm run dev
```

### Start Frontend

```bash
cd skillbridge-frontend
npm run dev
```

### Seed Database

```bash
cd skillbridge-backend
npm run seed
```

## Test Credentials

### Admin
- Email: `admin@skillbridge.com`
- Password: `admin123`

### Tutors
- `john.tutor@skillbridge.com` / `password123`
- `sarah.tutor@skillbridge.com` / `password123`
- `mike.tutor@skillbridge.com` / `password123`
- `emma.tutor@skillbridge.com` / `password123`
- `david.tutor@skillbridge.com` / `password123`
- `lisa.tutor@skillbridge.com` / `password123`

### Students
- `student@skillbridge.com` / `password123`
- `maria.student@skillbridge.com` / `password123`
- `james.student@skillbridge.com` / `password123`

## CORS Configuration

Backend CORS settings:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,  // Allow cookies
}));
```

## Troubleshooting

### Authentication Issues

1. **Cookie not being set**: Check CORS configuration
2. **Cookie not being sent**: Ensure `credentials: 'include'` in fetch
3. **Token invalid**: Check JWT_SECRET matches

### Connection Issues

1. **Backend not running**: Start with `npm run dev`
2. **Database connection**: Check DATABASE_URL in .env
3. **Port conflicts**: Ensure ports 3000 and 5000 are available

### Common Errors

| Error | Solution |
|-------|----------|
| CORS error | Check FRONTEND_URL in backend .env |
| 401 Unauthorized | Check cookie settings and token validity |
| 403 Forbidden | Check user role permissions |
| 404 Not Found | Check API endpoint path |

## Security Considerations

1. **HTTP-Only Cookies**: Prevents XSS attacks
2. **SameSite=Lax**: CSRF protection
3. **JWT Expiration**: 30 days default
4. **Role-Based Access**: Endpoint protection by role
5. **Input Validation**: Zod schemas on all inputs