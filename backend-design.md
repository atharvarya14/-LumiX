# LumiX Backend API — Implementation Design

**Version**: 1.0  
**Base URL**: `http://localhost:5000/api`  
**Auth**: JWT Bearer tokens  
**Content-Type**: `application/json`

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Authentication System](#authentication-system)
3. [Standard Response Format](#standard-response-format)
4. [Auth Endpoints](#auth-endpoints)
5. [User Endpoints](#user-endpoints)
6. [Class Endpoints](#class-endpoints)
7. [Lesson Plan Endpoints](#lesson-plan-endpoints)
8. [Timetable Endpoints](#timetable-endpoints)
9. [Assignment Endpoints](#assignment-endpoints)
10. [Message Endpoints](#message-endpoints)
11. [Data Models Reference](#data-models-reference)
12. [Error Codes Reference](#error-codes-reference)

---

## Architecture Overview

```
Frontend (React/Vue/Angular SPA)
        │
        ▼
Express.js Server (Node.js)
        │
        ├── Middleware Stack
        │   ├── Helmet (security headers)
        │   ├── CORS (origin whitelist)
        │   ├── Rate Limiter (100 req/15min global, 20 req/15min on /auth)
        │   ├── Body Parser (JSON, 10mb limit)
        │   ├── Morgan (request logging)
        │   └── JWT Auth (authenticate + authorize middleware)
        │
        ├── Route Layer (/api/*)
        │   ├── /auth
        │   ├── /users
        │   ├── /classes
        │   ├── /lesson-plans
        │   ├── /timetables
        │   ├── /assignments
        │   └── /messages
        │
        ├── Controller Layer (business logic)
        └── MongoDB (via Mongoose ODM)
```

### Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Auth | JWT (jsonwebtoken) |
| Password Hashing | bcryptjs |
| Validation | express-validator |
| Security | helmet, cors, express-rate-limit |

### Environment Variables (`.env`)

```dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/lumix
JWT_SECRET=<64+ char secret>
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=<different 64+ char secret>
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_MAX=20
BCRYPT_SALT_ROUNDS=12
```

---

## Authentication System

### How It Works

1. User calls `POST /api/auth/login` with email + password
2. Server returns `accessToken` (15 min) and `refreshToken` (7 days)
3. Frontend stores both tokens securely
4. Every API request must include the access token:
   ```
   Authorization: Bearer <accessToken>
   ```
5. When access token expires (401 response), call `POST /api/auth/refresh` with the refresh token to get new tokens
6. On logout, refresh token is invalidated server-side

### Role-Based Access Control (RBAC)

There are 4 roles: `teacher`, `student`, `parent`, `admin`

| Role | Permissions |
|---|---|
| `admin` | Full access to everything |
| `teacher` | CRUD on their own classes, lesson plans, timetables, assignments. Read students in their classes. Send messages. |
| `student` | Read their own classes, assignments, timetable. Submit assignments. Send/receive messages. |
| `parent` | Read their child's data. Send/receive messages with teachers. |

---

## Standard Response Format

### Success Response
```json
{
  "success": true,
  "message": "Human readable message",
  "data": {
    // response payload here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Human readable error message",
  "errors": [
    // Only present for validation errors (422)
    {
      "type": "field",
      "msg": "Password must be at least 8 characters",
      "path": "password",
      "location": "body"
    }
  ]
}
```

### HTTP Status Codes Used

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / invalid input |
| 401 | Unauthenticated (missing or expired token) |
| 403 | Forbidden (authenticated but no permission) |
| 404 | Resource not found |
| 409 | Conflict (e.g. email already exists) |
| 422 | Validation failed |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## Auth Endpoints

Base path: `/api/auth`  
Rate limited: **20 requests per 15 minutes** per IP

---

### POST `/api/auth/register`

Register a new user account.

**Auth required**: No

**Request Body**:
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@school.com",
  "password": "mypassword123",
  "role": "teacher",
  "subject": "Mathematics",
  "department": "STEM"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| firstName | string | Yes | |
| lastName | string | Yes | |
| email | string | Yes | Must be valid email, unique |
| password | string | Yes | Min 8 characters |
| role | string | No | `teacher` \| `student` \| `parent` \| `admin`. Defaults to `student` |
| subject | string | No | Teachers only |
| department | string | No | Teachers only |
| grade | string | No | Students only |

**Success Response** `201`:
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@school.com",
      "role": "teacher",
      "subject": "Mathematics",
      "department": "STEM",
      "isActive": true,
      "createdAt": "2025-06-01T10:00:00.000Z",
      "updatedAt": "2025-06-01T10:00:00.000Z",
      "fullName": "Jane Doe"
    }
  }
}
```

**Error Responses**:
- `409` — Email already in use
- `422` — Validation failed (missing fields, invalid email, short password)

---

### POST `/api/auth/login`

Login with email and password.

**Auth required**: No

**Request Body**:
```json
{
  "email": "jane@school.com",
  "password": "mypassword123"
}
```

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@school.com",
      "role": "teacher",
      "isActive": true,
      "lastLogin": "2025-06-01T10:00:00.000Z",
      "fullName": "Jane Doe"
    }
  }
}
```

**Error Responses**:
- `401` — Invalid email or password
- `422` — Validation failed

---

### POST `/api/auth/refresh`

Exchange a refresh token for a new access token + refresh token pair. Old refresh token is invalidated.

**Auth required**: No

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses**:
- `400` — Refresh token missing
- `401` — Invalid or expired refresh token

---

### POST `/api/auth/logout`

Logout and invalidate the refresh token server-side.

**Auth required**: Yes

**Request Body**: None

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": {}
}
```

---

### GET `/api/auth/me`

Get the currently authenticated user's profile.

**Auth required**: Yes

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "user": {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@school.com",
      "role": "teacher",
      "subject": "Mathematics",
      "department": "STEM",
      "isActive": true,
      "lastLogin": "2025-06-01T10:00:00.000Z",
      "createdAt": "2025-06-01T10:00:00.000Z",
      "fullName": "Jane Doe"
    }
  }
}
```

---

## User Endpoints

Base path: `/api/users`  
**All routes require authentication.**

---

### GET `/api/users`

List all users. **Admin only.**

**Query Parameters**:

| Param | Type | Description |
|---|---|---|
| role | string | Filter by role: `teacher` \| `student` \| `parent` \| `admin` |
| page | number | Page number (default: 1) |
| limit | number | Results per page (default: 20) |

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "users": [
      {
        "_id": "665f1a2b3c4d5e6f7a8b9c0d",
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "jane@school.com",
        "role": "teacher",
        "subject": "Mathematics",
        "isActive": true,
        "createdAt": "2025-06-01T10:00:00.000Z",
        "fullName": "Jane Doe"
      }
    ],
    "total": 42
  }
}
```

---

### GET `/api/users/:id`

Get a user by ID. Users can only fetch themselves; admins can fetch anyone.

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "user": {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@school.com",
      "role": "teacher",
      "subject": "Mathematics",
      "department": "STEM",
      "isActive": true,
      "profilePicture": "https://storage.example.com/avatars/jane.jpg",
      "createdAt": "2025-06-01T10:00:00.000Z",
      "fullName": "Jane Doe"
    }
  }
}
```

**Error Responses**:
- `403` — Trying to access another user's profile
- `404` — User not found

---

### PUT `/api/users/:id`

Update user profile. Users can only update themselves; admins can update anyone. **Password and role cannot be changed through this endpoint.**

**Request Body** (all fields optional):
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "subject": "Physics",
  "department": "Science",
  "grade": "Grade 6",
  "profilePicture": "https://storage.example.com/avatars/jane.jpg"
}
```

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Profile updated",
  "data": {
    "user": {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@school.com",
      "role": "teacher",
      "subject": "Physics",
      "fullName": "Jane Smith"
    }
  }
}
```

---

### DELETE `/api/users/:id`

Deactivate a user (soft delete — sets `isActive: false`). **Admin only.**

**Success Response** `200`:
```json
{
  "success": true,
  "message": "User deactivated",
  "data": {}
}
```

---

## Class Endpoints

Base path: `/api/classes`  
**All routes require authentication.**

---

### GET `/api/classes`

List classes. Results are automatically filtered by role:
- **Teacher**: sees only their own classes
- **Student**: sees only classes they are enrolled in
- **Admin**: sees all classes

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "classes": [
      {
        "_id": "665f2b3c4d5e6f7a8b9c0e1f",
        "name": "Math 101",
        "subject": "Mathematics",
        "grade": "Grade 5",
        "description": "Introduction to algebra",
        "teacher": {
          "_id": "665f1a2b3c4d5e6f7a8b9c0d",
          "firstName": "Jane",
          "lastName": "Doe",
          "email": "jane@school.com"
        },
        "students": [
          {
            "_id": "665f3c4d5e6f7a8b9c0e1f2a",
            "firstName": "John",
            "lastName": "Smith",
            "email": "john@school.com",
            "grade": "Grade 5"
          }
        ],
        "isActive": true,
        "liveSession": {
          "isLive": false,
          "startedAt": null,
          "sessionId": null
        },
        "createdAt": "2025-06-01T10:00:00.000Z"
      }
    ]
  }
}
```

---

### GET `/api/classes/:id`

Get a single class by ID with full details.

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "class": {
      "_id": "665f2b3c4d5e6f7a8b9c0e1f",
      "name": "Math 101",
      "subject": "Mathematics",
      "grade": "Grade 5",
      "description": "Introduction to algebra",
      "teacher": {
        "_id": "665f1a2b3c4d5e6f7a8b9c0d",
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "jane@school.com"
      },
      "students": [...],
      "isActive": true,
      "liveSession": {
        "isLive": false
      },
      "createdAt": "2025-06-01T10:00:00.000Z",
      "updatedAt": "2025-06-01T10:00:00.000Z"
    }
  }
}
```

---

### POST `/api/classes`

Create a new class. **Teacher, Admin only.**  
The authenticated teacher is automatically set as the class teacher.

**Request Body**:
```json
{
  "name": "Math 101",
  "subject": "Mathematics",
  "grade": "Grade 5",
  "description": "Introduction to algebra and basic equations"
}
```

| Field | Type | Required |
|---|---|---|
| name | string | Yes |
| subject | string | Yes |
| grade | string | Yes |
| description | string | No |

**Success Response** `201`:
```json
{
  "success": true,
  "message": "Class created",
  "data": {
    "class": {
      "_id": "665f2b3c4d5e6f7a8b9c0e1f",
      "name": "Math 101",
      "subject": "Mathematics",
      "grade": "Grade 5",
      "description": "Introduction to algebra and basic equations",
      "teacher": "665f1a2b3c4d5e6f7a8b9c0d",
      "students": [],
      "isActive": true,
      "liveSession": { "isLive": false },
      "createdAt": "2025-06-01T10:00:00.000Z"
    }
  }
}
```

---

### PUT `/api/classes/:id`

Update class details. **Teacher (own class), Admin only.**  
The `students` array cannot be modified through this endpoint — use the student management endpoints below.

**Request Body** (all fields optional):
```json
{
  "name": "Math 101 — Advanced",
  "description": "Updated description",
  "isActive": true
}
```

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Class updated",
  "data": {
    "class": { ...updatedClassObject }
  }
}
```

---

### DELETE `/api/classes/:id`

Delete a class. **Admin only.**

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Class deleted",
  "data": {}
}
```

---

### GET `/api/classes/:id/students`

List all students enrolled in a class.

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "students": [
      {
        "_id": "665f3c4d5e6f7a8b9c0e1f2a",
        "firstName": "John",
        "lastName": "Smith",
        "email": "john@school.com",
        "grade": "Grade 5",
        "profilePicture": null
      }
    ],
    "count": 1
  }
}
```

---

### POST `/api/classes/:id/students`

Add one or more students to a class. **Teacher (own class), Admin only.**  
Only active user accounts with `role: "student"` can be added. Duplicates are silently ignored.

**Request Body**:
```json
{
  "studentIds": [
    "665f3c4d5e6f7a8b9c0e1f2a",
    "665f4d5e6f7a8b9c0e1f2a3b"
  ]
}
```

**Success Response** `200`:
```json
{
  "success": true,
  "message": "2 student(s) added",
  "data": {
    "students": [
      {
        "_id": "665f3c4d5e6f7a8b9c0e1f2a",
        "firstName": "John",
        "lastName": "Smith",
        "email": "john@school.com",
        "grade": "Grade 5"
      },
      {
        "_id": "665f4d5e6f7a8b9c0e1f2a3b",
        "firstName": "Emily",
        "lastName": "Brown",
        "email": "emily@school.com",
        "grade": "Grade 5"
      }
    ]
  }
}
```

**Error Responses**:
- `400` — `studentIds` is empty or not an array
- `400` — None of the provided IDs are valid student accounts

---

### DELETE `/api/classes/:id/students/:studentId`

Remove a single student from a class. **Teacher (own class), Admin only.**

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Student removed from class",
  "data": {
    "students": [ ...remainingStudents ]
  }
}
```

---

## Lesson Plan Endpoints

Base path: `/api/lesson-plans`  
**All routes require authentication.**

---

### GET `/api/lesson-plans`

List lesson plans. Teachers see only their own plans. Supports pagination and filtering.

**Query Parameters**:

| Param | Type | Description |
|---|---|---|
| status | string | `draft` \| `published` \| `archived` |
| classId | string | Filter by class ObjectId |
| page | number | Default: 1 |
| limit | number | Default: 20 |

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "plans": [
      {
        "_id": "665f5e6f7a8b9c0e1f2a3b4c",
        "title": "Introduction to Fractions",
        "subject": "Mathematics",
        "grade": "Grade 5",
        "description": "Understanding numerators and denominators",
        "objectives": [
          "Understand what a fraction represents",
          "Identify numerator and denominator",
          "Add simple fractions with same denominator"
        ],
        "content": "## Lesson Content\n\nStart with a pizza analogy...",
        "resources": [
          "https://example.com/fractions-worksheet.pdf"
        ],
        "duration": 45,
        "teacher": {
          "_id": "665f1a2b3c4d5e6f7a8b9c0d",
          "firstName": "Jane",
          "lastName": "Doe"
        },
        "class": {
          "_id": "665f2b3c4d5e6f7a8b9c0e1f",
          "name": "Math 101",
          "subject": "Mathematics"
        },
        "scheduledDate": "2025-09-01T09:00:00.000Z",
        "status": "published",
        "tags": ["fractions", "arithmetic"],
        "createdAt": "2025-08-01T10:00:00.000Z",
        "updatedAt": "2025-08-01T10:00:00.000Z"
      }
    ],
    "total": 15,
    "page": 1,
    "limit": 20
  }
}
```

---

### GET `/api/lesson-plans/:id`

Get a single lesson plan. Teachers can only fetch their own.

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "plan": {
      "_id": "665f5e6f7a8b9c0e1f2a3b4c",
      "title": "Introduction to Fractions",
      "subject": "Mathematics",
      "grade": "Grade 5",
      "description": "Understanding numerators and denominators",
      "objectives": ["Understand what a fraction represents"],
      "content": "## Lesson Content\n\nFull lesson content here...",
      "resources": ["https://example.com/worksheet.pdf"],
      "duration": 45,
      "teacher": {
        "_id": "665f1a2b3c4d5e6f7a8b9c0d",
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "jane@school.com"
      },
      "class": {
        "_id": "665f2b3c4d5e6f7a8b9c0e1f",
        "name": "Math 101",
        "subject": "Mathematics",
        "grade": "Grade 5"
      },
      "scheduledDate": "2025-09-01T09:00:00.000Z",
      "status": "published",
      "tags": ["fractions", "arithmetic"],
      "createdAt": "2025-08-01T10:00:00.000Z"
    }
  }
}
```

---

### POST `/api/lesson-plans`

Create a new lesson plan. **Teacher, Admin only.**  
Authenticated teacher is automatically set as the owner.

**Request Body**:
```json
{
  "title": "Introduction to Fractions",
  "subject": "Mathematics",
  "grade": "Grade 5",
  "description": "Understanding numerators and denominators",
  "objectives": [
    "Understand what a fraction represents",
    "Add simple fractions"
  ],
  "content": "## Lesson Content\n\nFull lesson text or markdown here...",
  "resources": [
    "https://example.com/fractions-worksheet.pdf"
  ],
  "duration": 45,
  "class": "665f2b3c4d5e6f7a8b9c0e1f",
  "scheduledDate": "2025-09-01T09:00:00.000Z",
  "status": "draft",
  "tags": ["fractions", "arithmetic"]
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| title | string | Yes | |
| subject | string | Yes | |
| grade | string | Yes | |
| description | string | No | |
| objectives | string[] | No | Array of objective strings |
| content | string | No | Supports markdown |
| resources | string[] | No | Array of URLs |
| duration | number | No | Duration in minutes |
| class | ObjectId | No | Reference to a Class |
| scheduledDate | ISO Date | No | |
| status | string | No | `draft` \| `published` \| `archived`. Default: `draft` |
| tags | string[] | No | |

**Success Response** `201`:
```json
{
  "success": true,
  "message": "Lesson plan created",
  "data": {
    "plan": { ...createdPlanObject }
  }
}
```

---

### PUT `/api/lesson-plans/:id`

Update a lesson plan. **Teacher (own plan), Admin only.**  
All fields are optional — only provided fields are updated.

**Request Body** (same fields as POST, all optional):
```json
{
  "title": "Introduction to Fractions — Updated",
  "status": "published",
  "duration": 50
}
```

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Lesson plan updated",
  "data": {
    "plan": { ...updatedPlanObject }
  }
}
```

---

### DELETE `/api/lesson-plans/:id`

Delete a lesson plan. **Teacher (own plan), Admin only.**

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Lesson plan deleted",
  "data": {}
}
```

---

## Timetable Endpoints

Base path: `/api/timetables`  
**All routes require authentication.**

---

### GET `/api/timetables`

List timetables. Teachers see only their own.

**Query Parameters**:

| Param | Type | Description |
|---|---|---|
| classId | string | Filter by class ObjectId |
| active | boolean | `true` \| `false` |

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "timetables": [
      {
        "_id": "665f6f7a8b9c0e1f2a3b4c5d",
        "name": "Spring 2025 Semester",
        "academicYear": "2024-2025",
        "term": "Spring",
        "isActive": true,
        "class": {
          "_id": "665f2b3c4d5e6f7a8b9c0e1f",
          "name": "Math 101",
          "subject": "Mathematics",
          "grade": "Grade 5"
        },
        "teacher": {
          "_id": "665f1a2b3c4d5e6f7a8b9c0d",
          "firstName": "Jane",
          "lastName": "Doe"
        },
        "entries": [
          {
            "_id": "665f7a8b9c0e1f2a3b4c5d6e",
            "dayOfWeek": "Monday",
            "startTime": "09:00",
            "endTime": "10:00",
            "subject": "Mathematics",
            "class": { "_id": "...", "name": "Math 101" },
            "teacher": { "_id": "...", "firstName": "Jane", "lastName": "Doe" },
            "room": "Room 101",
            "notes": "Bring graph paper"
          }
        ],
        "createdAt": "2025-01-01T10:00:00.000Z"
      }
    ]
  }
}
```

---

### GET `/api/timetables/:id`

Get a single timetable with all entries fully populated.

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "timetable": { ...fullTimetableObject }
  }
}
```

---

### POST `/api/timetables`

Create a new timetable. **Teacher, Admin only.**

**Request Body**:
```json
{
  "name": "Spring 2025 Semester",
  "academicYear": "2024-2025",
  "term": "Spring",
  "class": "665f2b3c4d5e6f7a8b9c0e1f",
  "teacher": "665f1a2b3c4d5e6f7a8b9c0d",
  "isActive": true,
  "entries": [
    {
      "dayOfWeek": "Monday",
      "startTime": "09:00",
      "endTime": "10:00",
      "subject": "Mathematics",
      "class": "665f2b3c4d5e6f7a8b9c0e1f",
      "teacher": "665f1a2b3c4d5e6f7a8b9c0d",
      "room": "Room 101",
      "notes": "Bring graph paper"
    },
    {
      "dayOfWeek": "Wednesday",
      "startTime": "11:00",
      "endTime": "12:00",
      "subject": "Mathematics",
      "class": "665f2b3c4d5e6f7a8b9c0e1f",
      "teacher": "665f1a2b3c4d5e6f7a8b9c0d",
      "room": "Room 101"
    }
  ]
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| name | string | Yes | |
| academicYear | string | Yes | e.g. `"2024-2025"` |
| term | string | No | e.g. `"Spring"`, `"Fall"` |
| class | ObjectId | No | Reference to a Class |
| teacher | ObjectId | No | Reference to a User (teacher) |
| isActive | boolean | No | Default: `true` |
| entries | Entry[] | No | Array of timetable entries (see below) |

**Entry object fields**:

| Field | Type | Required |
|---|---|---|
| dayOfWeek | string | Yes | `Monday` \| `Tuesday` \| `Wednesday` \| `Thursday` \| `Friday` \| `Saturday` \| `Sunday` |
| startTime | string | Yes | 24hr format: `"09:00"` |
| endTime | string | Yes | 24hr format: `"10:00"` |
| subject | string | Yes | |
| class | ObjectId | Yes | |
| teacher | ObjectId | Yes | |
| room | string | No | |
| notes | string | No | |

**Success Response** `201`:
```json
{
  "success": true,
  "message": "Timetable created",
  "data": {
    "timetable": { ...createdTimetableObject }
  }
}
```

---

### PUT `/api/timetables/:id`

Update a timetable. **Teacher (own timetable), Admin only.**

**Request Body** (all fields optional):
```json
{
  "name": "Spring 2025 — Updated",
  "isActive": false
}
```

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Timetable updated",
  "data": {
    "timetable": { ...updatedTimetableObject }
  }
}
```

---

### DELETE `/api/timetables/:id`

Delete a timetable. **Teacher (own), Admin only.**

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Timetable deleted",
  "data": {}
}
```

---

### POST `/api/timetables/:id/entries`

Add a single entry to an existing timetable. **Teacher, Admin only.**

**Request Body**:
```json
{
  "dayOfWeek": "Friday",
  "startTime": "14:00",
  "endTime": "15:00",
  "subject": "Mathematics",
  "class": "665f2b3c4d5e6f7a8b9c0e1f",
  "teacher": "665f1a2b3c4d5e6f7a8b9c0d",
  "room": "Room 102",
  "notes": "Extra practice session"
}
```

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Entry added",
  "data": {
    "timetable": { ...timetableWithNewEntry }
  }
}
```

---

### DELETE `/api/timetables/:id/entries/:entryId`

Remove a single entry from a timetable. **Teacher, Admin only.**

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Entry removed",
  "data": {
    "timetable": { ...timetableWithoutEntry }
  }
}
```

---

## Assignment Endpoints

Base path: `/api/assignments`  
**All routes require authentication.**

---

### GET `/api/assignments`

List assignments. Teachers see only their own. Students see assignments for their classes. Submissions are excluded from the list view.

**Query Parameters**:

| Param | Type | Description |
|---|---|---|
| classId | string | Filter by class ObjectId |
| status | string | `draft` \| `published` \| `closed` |
| page | number | Default: 1 |
| limit | number | Default: 20 |

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "assignments": [
      {
        "_id": "665f8b9c0e1f2a3b4c5d6e7f",
        "title": "Algebra Homework 1",
        "description": "Solve problems 1-20 from Chapter 3",
        "subject": "Mathematics",
        "class": {
          "_id": "665f2b3c4d5e6f7a8b9c0e1f",
          "name": "Math 101",
          "subject": "Mathematics"
        },
        "teacher": {
          "_id": "665f1a2b3c4d5e6f7a8b9c0d",
          "firstName": "Jane",
          "lastName": "Doe"
        },
        "dueDate": "2025-09-15T23:59:00.000Z",
        "totalMarks": 100,
        "status": "published",
        "createdAt": "2025-09-01T10:00:00.000Z"
      }
    ],
    "total": 8,
    "page": 1,
    "limit": 20
  }
}
```

---

### GET `/api/assignments/:id`

Get a single assignment with full details.  
**Students** receive the full assignment but only their own submission (not all submissions).  
**Teachers/Admins** receive all submissions.

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "assignment": {
      "_id": "665f8b9c0e1f2a3b4c5d6e7f",
      "title": "Algebra Homework 1",
      "description": "Solve problems 1-20 from Chapter 3",
      "subject": "Mathematics",
      "class": {
        "_id": "665f2b3c4d5e6f7a8b9c0e1f",
        "name": "Math 101",
        "subject": "Mathematics",
        "grade": "Grade 5"
      },
      "teacher": {
        "_id": "665f1a2b3c4d5e6f7a8b9c0d",
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "jane@school.com"
      },
      "dueDate": "2025-09-15T23:59:00.000Z",
      "totalMarks": 100,
      "attachments": [],
      "instructions": "Show all working. No calculators.",
      "status": "published",
      "submissions": [
        {
          "_id": "665f9c0e1f2a3b4c5d6e7f8a",
          "student": {
            "_id": "665f3c4d5e6f7a8b9c0e1f2a",
            "firstName": "John",
            "lastName": "Smith",
            "email": "john@school.com"
          },
          "submittedAt": "2025-09-14T18:30:00.000Z",
          "content": "Problem 1: x = 5, Problem 2: y = 3...",
          "attachments": ["https://storage.example.com/submissions/john-hw1.pdf"],
          "grade": 87,
          "feedback": "Great work! Minor error in Q5.",
          "gradedAt": "2025-09-16T10:00:00.000Z",
          "gradedBy": "665f1a2b3c4d5e6f7a8b9c0d",
          "status": "graded"
        }
      ],
      "createdAt": "2025-09-01T10:00:00.000Z"
    }
  }
}
```

---

### POST `/api/assignments`

Create a new assignment. **Teacher, Admin only.**

**Request Body**:
```json
{
  "title": "Algebra Homework 1",
  "description": "Solve problems 1-20 from Chapter 3",
  "subject": "Mathematics",
  "class": "665f2b3c4d5e6f7a8b9c0e1f",
  "dueDate": "2025-09-15T23:59:00.000Z",
  "totalMarks": 100,
  "attachments": [
    "https://storage.example.com/assignments/chapter3.pdf"
  ],
  "instructions": "Show all working. No calculators.",
  "status": "published"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| title | string | Yes | |
| description | string | Yes | |
| subject | string | Yes | |
| class | ObjectId | Yes | Reference to a Class |
| dueDate | ISO Date | Yes | |
| totalMarks | number | No | Default: 100 |
| attachments | string[] | No | Array of file URLs |
| instructions | string | No | |
| status | string | No | `draft` \| `published` \| `closed`. Default: `draft` |

**Success Response** `201`:
```json
{
  "success": true,
  "message": "Assignment created",
  "data": {
    "assignment": { ...createdAssignmentObject }
  }
}
```

---

### PUT `/api/assignments/:id`

Update an assignment. **Teacher (own assignment), Admin only.**  
The `submissions` array cannot be modified through this endpoint.

**Request Body** (all fields optional):
```json
{
  "title": "Algebra Homework 1 — Updated",
  "dueDate": "2025-09-20T23:59:00.000Z",
  "status": "closed"
}
```

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Assignment updated",
  "data": {
    "assignment": { ...updatedAssignmentObject }
  }
}
```

---

### DELETE `/api/assignments/:id`

Delete an assignment. **Teacher (own assignment), Admin only.**

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Assignment deleted",
  "data": {}
}
```

---

### POST `/api/assignments/:id/submit`

Student submits an assignment. **Student only.**  
Submission is automatically marked `late` if submitted after the due date.  
Returns `409` if the student has already submitted.

**Request Body**:
```json
{
  "content": "Problem 1: x = 5\nProblem 2: y = 3\n...",
  "attachments": [
    "https://storage.example.com/submissions/john-hw1.pdf"
  ]
}
```

| Field | Type | Required |
|---|---|---|
| content | string | No (at least one of content or attachments needed) |
| attachments | string[] | No |

**Success Response** `201`:
```json
{
  "success": true,
  "message": "Assignment submitted",
  "data": {
    "submission": {
      "_id": "665f9c0e1f2a3b4c5d6e7f8a",
      "student": "665f3c4d5e6f7a8b9c0e1f2a",
      "submittedAt": "2025-09-14T18:30:00.000Z",
      "content": "Problem 1: x = 5...",
      "attachments": ["https://storage.example.com/submissions/john-hw1.pdf"],
      "status": "submitted"
    }
  }
}
```

**Error Responses**:
- `400` — Assignment is closed (status: `closed`)
- `409` — Student has already submitted

---

### PUT `/api/assignments/:assignmentId/submissions/:submissionId/grade`

Teacher grades a student submission. **Teacher (own assignment), Admin only.**

**Request Body**:
```json
{
  "grade": 87,
  "feedback": "Great work overall! Minor algebra error in Question 5 — check your signs."
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| grade | number | Yes | 0 to `totalMarks` |
| feedback | string | No | |

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Submission graded",
  "data": {
    "submission": {
      "_id": "665f9c0e1f2a3b4c5d6e7f8a",
      "student": "665f3c4d5e6f7a8b9c0e1f2a",
      "submittedAt": "2025-09-14T18:30:00.000Z",
      "content": "Problem 1: x = 5...",
      "grade": 87,
      "feedback": "Great work overall!",
      "gradedAt": "2025-09-16T10:00:00.000Z",
      "gradedBy": "665f1a2b3c4d5e6f7a8b9c0d",
      "status": "graded"
    }
  }
}
```

---

## Message Endpoints

Base path: `/api/messages`  
**All routes require authentication.**

---

### GET `/api/messages/inbox`

Get messages received by the current user. Sorted newest first. Body is excluded from the list — fetch individual messages for full content.

**Query Parameters**:

| Param | Type | Description |
|---|---|---|
| page | number | Default: 1 |
| limit | number | Default: 20 |

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "messages": [
      {
        "_id": "665fad0e1f2a3b4c5d6e7f8a9b",
        "sender": {
          "_id": "665f1a2b3c4d5e6f7a8b9c0d",
          "firstName": "Jane",
          "lastName": "Doe",
          "role": "teacher"
        },
        "recipients": ["665f3c4d5e6f7a8b9c0e1f2a"],
        "subject": "Reminder: Assignment due tomorrow",
        "isAnnouncement": false,
        "readBy": [],
        "createdAt": "2025-09-14T08:00:00.000Z"
      }
    ],
    "total": 5
  }
}
```

---

### GET `/api/messages/sent`

Get messages sent by the current user. Returns last 50 messages.

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "messages": [
      {
        "_id": "665fad0e1f2a3b4c5d6e7f8a9b",
        "recipients": [
          {
            "_id": "665f3c4d5e6f7a8b9c0e1f2a",
            "firstName": "John",
            "lastName": "Smith",
            "role": "student"
          }
        ],
        "subject": "Reminder: Assignment due tomorrow",
        "isAnnouncement": false,
        "createdAt": "2025-09-14T08:00:00.000Z"
      }
    ]
  }
}
```

---

### GET `/api/messages/:id`

Get a single message with full body. Automatically marks the message as read for the current user.  
Only the sender and recipients can access a message.

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "message": {
      "_id": "665fad0e1f2a3b4c5d6e7f8a9b",
      "sender": {
        "_id": "665f1a2b3c4d5e6f7a8b9c0d",
        "firstName": "Jane",
        "lastName": "Doe",
        "role": "teacher"
      },
      "recipients": [
        {
          "_id": "665f3c4d5e6f7a8b9c0e1f2a",
          "firstName": "John",
          "lastName": "Smith",
          "role": "student"
        }
      ],
      "subject": "Reminder: Assignment due tomorrow",
      "body": "Hi John, just a reminder that Algebra Homework 1 is due tomorrow at midnight. Let me know if you have questions!",
      "attachments": [],
      "isAnnouncement": false,
      "class": null,
      "readBy": ["665f3c4d5e6f7a8b9c0e1f2a"],
      "parentMessage": null,
      "createdAt": "2025-09-14T08:00:00.000Z",
      "updatedAt": "2025-09-14T09:15:00.000Z"
    }
  }
}
```

---

### POST `/api/messages`

Send a message to one or more users.

**Request Body**:
```json
{
  "recipients": [
    "665f3c4d5e6f7a8b9c0e1f2a",
    "665f4d5e6f7a8b9c0e1f2a3b"
  ],
  "subject": "Reminder: Assignment due tomorrow",
  "body": "Hi everyone, just a reminder that Algebra Homework 1 is due tomorrow at midnight.",
  "attachments": [],
  "classId": "665f2b3c4d5e6f7a8b9c0e1f",
  "isAnnouncement": false,
  "parentMessageId": null
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| recipients | ObjectId[] | Yes | Array of user IDs |
| body | string | Yes | Message body text |
| subject | string | No | |
| attachments | string[] | No | Array of file URLs |
| classId | ObjectId | No | Attach message to a class context |
| isAnnouncement | boolean | No | Default: `false` |
| parentMessageId | ObjectId | No | For threaded replies — ID of parent message |

**Success Response** `201`:
```json
{
  "success": true,
  "message": "Message sent",
  "data": {
    "message": {
      "_id": "665fad0e1f2a3b4c5d6e7f8a9b",
      "sender": {
        "_id": "665f1a2b3c4d5e6f7a8b9c0d",
        "firstName": "Jane",
        "lastName": "Doe",
        "role": "teacher"
      },
      "recipients": ["665f3c4d5e6f7a8b9c0e1f2a"],
      "subject": "Reminder: Assignment due tomorrow",
      "body": "Hi everyone...",
      "isAnnouncement": false,
      "readBy": [],
      "createdAt": "2025-09-14T08:00:00.000Z"
    }
  }
}
```

---

### DELETE `/api/messages/:id`

Delete a message. Only the original sender or an admin can delete.

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Message deleted",
  "data": {}
}
```

---

## Data Models Reference

### User
```
_id           ObjectId
firstName     String (required)
lastName      String (required)
email         String (required, unique, lowercase)
password      String (hashed, never returned in responses)
role          "teacher" | "student" | "parent" | "admin"
subject       String (teachers)
department    String (teachers)
grade         String (students)
parentId      ObjectId → User (students)
childIds      ObjectId[] → User (parents)
isActive      Boolean (default: true)
lastLogin     Date
profilePicture String (URL)
refreshToken  String (hashed, never returned in responses)
createdAt     Date
updatedAt     Date
fullName      String (virtual: firstName + lastName)
```

### Class
```
_id           ObjectId
name          String (required)
subject       String (required)
grade         String (required)
description   String
teacher       ObjectId → User (required)
students      ObjectId[] → User
isActive      Boolean (default: true)
liveSession   { isLive: Boolean, startedAt: Date, sessionId: String }
createdAt     Date
updatedAt     Date
```

### LessonPlan
```
_id           ObjectId
title         String (required)
subject       String (required)
grade         String (required)
description   String
objectives    String[]
content       String (markdown)
resources     String[] (URLs)
duration      Number (minutes)
teacher       ObjectId → User (required)
class         ObjectId → Class
scheduledDate Date
status        "draft" | "published" | "archived" (default: "draft")
tags          String[]
createdAt     Date
updatedAt     Date
```

### Timetable
```
_id           ObjectId
name          String (required)
academicYear  String (required)
term          String
isActive      Boolean (default: true)
createdBy     ObjectId → User (required)
class         ObjectId → Class
teacher       ObjectId → User
entries       TimetableEntry[]
createdAt     Date
updatedAt     Date

TimetableEntry:
  _id         ObjectId
  dayOfWeek   "Monday"|"Tuesday"|"Wednesday"|"Thursday"|"Friday"|"Saturday"|"Sunday"
  startTime   String ("09:00")
  endTime     String ("10:00")
  subject     String (required)
  class       ObjectId → Class (required)
  teacher     ObjectId → User (required)
  room        String
  notes       String
```

### Assignment
```
_id           ObjectId
title         String (required)
description   String (required)
subject       String (required)
class         ObjectId → Class (required)
teacher       ObjectId → User (required)
dueDate       Date (required)
totalMarks    Number (default: 100)
attachments   String[] (URLs)
instructions  String
status        "draft" | "published" | "closed" (default: "draft")
submissions   Submission[]
createdAt     Date
updatedAt     Date

Submission:
  _id         ObjectId
  student     ObjectId → User (required)
  submittedAt Date
  content     String
  attachments String[] (URLs)
  grade       Number (0–100)
  feedback    String
  gradedAt    Date
  gradedBy    ObjectId → User
  status      "submitted" | "late" | "graded" | "returned"
```

### Message
```
_id             ObjectId
sender          ObjectId → User (required)
recipients      ObjectId[] → User (required)
subject         String
body            String (required)
attachments     String[] (URLs)
isAnnouncement  Boolean (default: false)
class           ObjectId → Class
readBy          ObjectId[] → User
parentMessage   ObjectId → Message (for threading)
createdAt       Date
updatedAt       Date
```

---

## Error Codes Reference

| HTTP Code | When It Occurs |
|---|---|
| 400 | Missing required fields, invalid ObjectId format, business logic violation (e.g. assignment closed) |
| 401 | No token provided, token expired, token invalid, refresh token mismatch |
| 403 | Authenticated but wrong role, or trying to access another user's resource |
| 404 | Document with the given ID does not exist in the database |
| 409 | Duplicate email on register, student already submitted an assignment |
| 422 | express-validator validation failed — check the `errors` array in response |
| 429 | Rate limit exceeded — wait before retrying |
| 500 | Unexpected server error — check server logs |

---

## Frontend Integration Notes

### Token Storage
Store `accessToken` in memory (React state/context) and `refreshToken` in an `httpOnly` cookie or `localStorage`. Never store `accessToken` in `localStorage`.

### Axios Interceptor Pattern
```javascript
// Attach token to every request
axios.interceptors.request.use(config => {
  const token = getAccessToken(); // from memory/state
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const { accessToken, refreshToken } = await refreshTokens();
      setAccessToken(accessToken);
      error.config.headers.Authorization = `Bearer ${accessToken}`;
      return axios(error.config);
    }
    return Promise.reject(error);
  }
);
```

### Role-Based Routing
Check `user.role` from `/api/auth/me` or login response to route users to their dashboards:
- `teacher` → Teacher Dashboard
- `student` → Student Dashboard
- `parent` → Parent Dashboard
- `admin` → Admin Panel

### Pagination
List endpoints return `total`, `page`, and `limit`. Use these to build pagination controls:
```javascript
const totalPages = Math.ceil(total / limit);
```
