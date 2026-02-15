# SkillBridge Test Credentials

Use these credentials to test the authentication system in development:

## Test Accounts

### Student Account
- **Email:** `student@test.com`
- **Password:** `password123`
- **Role:** Student
- **Access:** Student dashboard, bookings, profile

### Tutor Account
- **Email:** `tutor@test.com`
- **Password:** `password123`
- **Role:** Tutor
- **Access:** Tutor dashboard, availability, sessions, profile

### Admin Account
- **Email:** `admin@skillbridge.com`
- **Password:** `admin123`
- **Role:** Admin
- **Access:** Admin dashboard, user management, all bookings, settings

## Creating New Test Accounts

You can register new accounts through the `/register` page with any email and password combination. New accounts will be stored in localStorage for the current browser session.

## Mock Authentication Features

- 1-second delay to simulate API calls
- Form validation (email format, password length, required fields)
- Error simulation:
  - Wrong password
  - Email already exists
  - Invalid credentials
  - Role-specific validation
- Automatic role-based routing after login
- Persistent sessions using localStorage

## Resetting Test Data

To reset all test data and registered users:
1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Clear localStorage for the SkillBridge app
4. Refresh the page

## Using the Service Directly

```typescript
import { mockLogin, mockRegister, MOCK_TEST_USERS } from '@/services/auth'

// Login example
const response = await mockLogin({
  email: MOCK_TEST_USERS.student.email,
  password: MOCK_TEST_USERS.student.password,
})

// Register example
const newUser = await mockRegister({
  fullName: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  confirmPassword: 'password123',
  role: 'student',
  educationLevel: 'undergraduate',
})
```
