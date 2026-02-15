# SkillBridge Testing Guide

## Test Credentials
See `TEST_CREDENTIALS.md` for login credentials.

## Comprehensive Feature Testing Checklist

### ✅ Authentication & Authorization
- [ ] **Register** - Create new accounts for each role (student, tutor)
- [ ] **Login** - Login with test credentials for all three roles
- [ ] **Logout** - Logout and verify redirect to home
- [ ] **Role Protection** - Try accessing tutor/admin routes as student (should redirect)
- [ ] **Unauthenticated Access** - Try accessing protected routes without login (should redirect to /login)

### ✅ Student Features
- [ ] **Dashboard**
  - [ ] View upcoming sessions count and details
  - [ ] See completed sessions and total hours
  - [ ] Check "Today's Session" countdown if booking exists today
  - [ ] View favorite tutors list
- [ ] **Browse Tutors** (`/browse`)
  - [ ] Search tutors by name, subject, or keyword
  - [ ] Filter by subject categories
  - [ ] Filter by price range using slider
  - [ ] Filter by minimum rating
  - [ ] Filter by availability
  - [ ] Sort by rating, price (low/high)
  - [ ] Click tutor card to view profile
- [ ] **Tutor Profile** (`/tutors/[id]`)
  - [ ] View tutor details, bio, subjects, reviews
  - [ ] Navigate week calendar for availability
  - [ ] Select date and time slot
  - [ ] Choose duration (1hr, 1.5hr, 2hr)
  - [ ] Click "Book Session" to open booking modal
  - [ ] Complete booking with subject and notes
  - [ ] Verify toast notification on successful booking
- [ ] **My Bookings** (`/dashboard/bookings`)
  - [ ] View all bookings in tabs (Upcoming, Past, Cancelled)
  - [ ] Join upcoming sessions
  - [ ] Cancel bookings with confirmation
  - [ ] Leave reviews for completed sessions
  - [ ] View booking details

### ✅ Tutor Features
- [ ] **Tutor Dashboard** (`/tutor/dashboard`)
  - [ ] View earnings summary (total, monthly)
  - [ ] See upcoming sessions count and today's sessions
  - [ ] View total students taught
  - [ ] Check average rating with visual indicator
  - [ ] View weekly booking activity chart
  - [ ] Read recent reviews
  - [ ] Check session requests (if any)
- [ ] **Sessions Management** (`/tutor/sessions`)
  - [ ] View all sessions with filters (Upcoming, Pending, Completed, Cancelled)
  - [ ] Confirm pending session requests
  - [ ] Decline session requests
  - [ ] Join upcoming sessions
  - [ ] Message students
  - [ ] Cancel bookings
  - [ ] View completed session reviews
- [ ] **Availability** (`/tutor/availability`)
  - [ ] View weekly calendar (Mon-Sun)
  - [ ] Toggle time slots on/off (9 AM - 9 PM, 30-min intervals)
  - [ ] Enable bulk edit mode for multiple selections
  - [ ] Navigate weeks (previous/next)
  - [ ] Copy availability to next week
  - [ ] Add exception dates for vacations
  - [ ] Save availability changes
- [ ] **Earnings** (`/tutor/earnings`)
  - [ ] View total earnings
  - [ ] See monthly earnings
  - [ ] Check pending and withdrawable amounts
  - [ ] View transaction history table
  - [ ] Filter transactions by date range
  - [ ] Export to CSV
  - [ ] Withdraw earnings (initiates payout)
- [ ] **Profile Edit** (`/tutor/profile`)
  - [ ] Upload profile photo (drag & drop or click)
  - [ ] Edit basic info (name, email, bio)
  - [ ] Add/remove subjects with expertise levels
  - [ ] Add/remove education entries
  - [ ] Select teaching style tags
  - [ ] Add video introduction URL
  - [ ] Toggle live preview
  - [ ] Save changes

### ✅ Admin Features
- [ ] **Admin Dashboard** (`/admin`)
  - [ ] View platform statistics (users, bookings, revenue, rating)
  - [ ] See user growth chart (6 months)
  - [ ] View top subjects by percentage
  - [ ] Check recent activity feed
  - [ ] View quick stats cards
- [ ] **User Management** (`/admin/users`)
  - [ ] Search users by name or email
  - [ ] Filter by role (All, Students, Tutors, Admins)
  - [ ] Filter by status (All, Active, Banned)
  - [ ] View user details in modal
  - [ ] Edit user role
  - [ ] Ban/unban users
  - [ ] Delete users with confirmation
  - [ ] Bulk actions (ban/unban multiple)
  - [ ] Pagination through user list
- [ ] **Bookings Management** (`/admin/bookings`)
  - [ ] View all platform bookings
  - [ ] Sort by date, amount, status
  - [ ] Filter bookings by status
  - [ ] View booking details
  - [ ] Cancel bookings
  - [ ] Initiate refunds for cancelled bookings
- [ ] **Categories** (`/admin/categories`)
  - [ ] View all subject categories
  - [ ] Add new category with icon
  - [ ] Edit category name and icon
  - [ ] Toggle category active/inactive
  - [ ] Delete unused categories
  - [ ] Prevent deletion of categories with assigned tutors

### ✅ Common Features
- [ ] **Navigation**
  - [ ] Navbar shows correct links based on user role
  - [ ] Mobile menu works properly
  - [ ] User dropdown shows profile info
  - [ ] Logout button works
  - [ ] Active route is highlighted
- [ ] **Notifications** (Tutors/Students)
  - [ ] Bell icon shows unread count badge
  - [ ] Click bell to open dropdown
  - [ ] View notifications with icons
  - [ ] Mark individual notifications as read
  - [ ] Mark all as read
  - [ ] Delete notifications
  - [ ] Click notification to navigate to relevant page
- [ ] **Responsive Design**
  - [ ] Test on mobile (320px - 768px)
  - [ ] Test on tablet (768px - 1024px)
  - [ ] Test on desktop (1024px+)
  - [ ] Verify all modals, dropdowns, and cards scale properly

### ✅ Data Persistence
- [ ] **LocalStorage**
  - [ ] Login persists on page refresh
  - [ ] Bookings persist across sessions
  - [ ] User preferences saved
  - [ ] Mock data initializes correctly on first visit

## Known Limitations (Development Mode)
- All data stored in localStorage (resets on browser clear)
- Mock 1-second delays for API simulation
- No real email notifications
- No real video conferencing (meeting links are placeholders)
- No real payment processing
- Image uploads simulated (no actual file storage)

## Reporting Issues
If you find any bugs or issues:
1. Note the steps to reproduce
2. Check browser console for errors
3. Verify you're using correct test credentials
4. Try clearing localStorage and testing again
5. Document expected vs actual behavior
