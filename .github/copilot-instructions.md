# Blood Bank Management System - AI Agent Instructions

## Project Overview
This is a full-stack blood bank management system with a React frontend (`/client`) and Express.js backend (`/server`). The system manages blood donations, hospital requests, inventory tracking, and multi-role user access.

## Architecture & Key Concepts

### Multi-Role System
The application has **4 distinct user roles** with separate authentication flows:
- **Donor**: Individuals who donate blood
- **Hospital**: Medical facilities requesting blood
- **Blood Lab**: Facilities managing blood inventory and camps  
- **Admin**: System administrators managing verification and oversight

**Critical**: Each role has its own dashboard route (`/donor`, `/hospital`, `/lab`, `/admin`) and protected pages. Always use the correct role when implementing features.

### Authentication Pattern
- **Frontend**: Uses React Router with nested routes and `ProtectedRoute` component
- **Backend**: JWT-based auth with `protect` middleware checking multiple user collections
- **Token Storage**: localStorage with automatic expiration checking in `utils/auth.js`
- **Multi-Model Auth**: The `authMiddleware.js` checks Donor, Admin, and Facility collections

### Database Architecture
**Key Models** (all in `/server/models/`):
- `donorModel.js`: Complex schema with donation history, eligibility virtual fields, and 90-day cooldown logic
- `facilityModel.js`: Handles both hospitals and blood labs with approval workflow
- `bloodModel.js` & `bloodRequestModel.js`: Inventory and request management

**Important Patterns**:
- Facilities have `status: "pending/approved/rejected"` approval flow
- Donors have automatic eligibility calculation via virtual fields
- All models use bcrypt pre-save hooks and comparison methods
- Role assignment happens automatically in facility pre-save middleware

## Development Commands

### Client (React + Vite)
```bash
cd client
npm run dev     # Development server on :5173
npm run build   # Production build
npm run lint    # ESLint checking
```

### Server (Express + MongoDB)
```bash
cd server
npm start       # Uses nodemon for auto-restart
```

**Environment Setup**: Server requires `.env` with `MONGO_URI`, `JWT_SECRET`, and `PORT=5000`

## Code Conventions & Patterns

### Component Structure
- **Layout System**: `DashboardLayout` component wraps all protected routes with role-based navigation
- **Page Organization**: Pages organized by role (`/pages/donor/`, `/pages/hospital/`, etc.)
- **Shared Components**: Common components in `/components/` (Header, Footer, ProtectedRoute)

### API Integration
- **Base URL**: All API calls use `http://localhost:5000/api`
- **Route Structure**: `/api/{role}/*` (e.g., `/api/donor/profile`, `/api/admin/facilities`)
- **Auth Headers**: Use `makeAuthenticatedRequest()` from `utils/auth.js` for protected endpoints

### Styling & UI
- **Framework**: Tailwind CSS with custom red color variables in `index.css`
- **Font**: Poppins font family applied globally via CSS
- **Color System**: Primary red `hsl(0, 84.2%, 60.2%)` defined as CSS custom properties

### Error Handling
- **Frontend**: React Hot Toast for notifications, automatic auth error handling
- **Backend**: Consistent error responses with proper HTTP status codes
- **Token Expiration**: Automatic logout and redirect on auth errors

## Critical Implementation Notes

### When Adding New Features:
1. **Check Role Context**: Always verify which user role the feature belongs to
2. **Use Correct Routes**: Follow the nested route pattern with proper role prefixes
3. **Auth Requirements**: Use `ProtectedRoute` for pages requiring authentication
4. **API Consistency**: Follow `/api/{role}/` endpoint structure
5. **State Management**: No global state library - use React useState/useEffect patterns

### Database Queries:
- Use `.select("-password")` to exclude passwords from responses
- Leverage mongoose virtuals for calculated fields (especially donor eligibility)
- Use proper population for references (e.g., facility references in donation history)

### File Upload Patterns:
- Handle FormData properly in `makeAuthenticatedRequest()` (don't set Content-Type)
- Store file metadata in models (url, filename, uploadedAt)

## Common Pitfalls to Avoid
- Don't mix user roles in API endpoints - each role has specific controllers
- Always use the `protect` middleware for authenticated routes
- Remember that facilities require admin approval before being functional
- Donor eligibility is calculated automatically - don't override virtual fields manually
- Use proper error handling for token expiration scenarios