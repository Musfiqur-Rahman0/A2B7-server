# DevPulse – Backend API

A collaborative issue tracking platform for software teams to report bugs, request features, and manage issue workflows.

---

# Live Server

🚀 Server URL:  
https://feature-server.vercel.app/

---

# Features

- User authentication with JWT
- Role-based authorization (`contributor`, `maintainer`)
- Secure password hashing using bcrypt
- Create, update, delete, and manage issues
- Public issue listing with filtering and sorting
- PostgreSQL database with raw SQL queries
- Centralized error handling
- Modular Express architecture
- TypeScript strict typing
- Environment variable configuration
- Deployed backend API

---

# Tech Stack

## Backend

- Node.js
- Express.js
- TypeScript

## Database

- PostgreSQL
- pg (native PostgreSQL driver)
- Raw SQL using `pool.query()`

## Authentication & Security

- bcrypt
- jsonwebtoken

## Additional Packages

- cors
- dotenv
- http-status-codes
- ts-node-dev

---

# Project Structure

```bash
src
│
├── app
│   ├── config
│   ├── middleware
│   ├── modules
│   │   ├── auth
│   │   └── issues
│   ├── utils
│   ├── interfaces
│   └── routes
│
├── app.ts
└── server.ts
```

---

# Installation & Setup

## 1. Clone the Repository

```bash
git clone <repository-url>
cd devpulse-backend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Create `.env` File

````env
PORT=5000

JWT_SECRET=your_super_secret_jwt_key

### Example PostgreSQL Connection String

```env
CONNECTION_STRING=postgresql://username:password@localhost:5432/devpulse
````

---

## 4. Run Development Server

```bash
npm run dev
```

---

## 5. Build Project

```bash
npm run build
```

---

# API Endpoints

## Authentication Routes

### Register User

```http
POST /api/auth/signup
```

### Login User

```http
POST /api/auth/login
```

---

## Issue Routes

### Create Issue

```http
POST /api/issues
```

### Get All Issues

```http
GET /api/issues
```

### Get Single Issue

```http
GET /api/issues/:id
```

### Update Issue

```http
PATCH /api/issues/:id
```

### Delete Issue

```http
DELETE /api/issues/:id
```

---

# Query Parameters

## Get All Issues

```http
GET /api/issues?sort=newest&type=bug&status=open
```

### Supported Query Params

| Parameter | Values                      |
| --------- | --------------------------- |
| sort      | newest, oldest              |
| type      | bug, feature_request        |
| status    | open, in_progress, resolved |

---

# Authentication System

The API uses JWT-based authentication.

## Authentication Flow

1. User logs in with email and password
2. Server validates credentials
3. JWT token is generated
4. Client stores token
5. Client sends token in request headers

```http
Authorization: <JWT_TOKEN>
```

---

# Authorization Rules

## Contributor

- Create issues
- View issues
- Update own issue when status is `open`

## Maintainer

- All contributor permissions
- Update any issue
- Delete any issue
- Change issue status independently

---

# Database Schema Summary

## Users Table

| Field      | Type               |
| ---------- | ------------------ |
| id         | SERIAL PRIMARY KEY |
| name       | VARCHAR            |
| email      | VARCHAR UNIQUE     |
| password   | TEXT               |
| role       | VARCHAR            |
| created_at | TIMESTAMP          |
| updated_at | TIMESTAMP          |

---

## Issues Table

| Field       | Type               |
| ----------- | ------------------ |
| id          | SERIAL PRIMARY KEY |
| title       | VARCHAR(150)       |
| description | TEXT               |
| type        | VARCHAR            |
| status      | VARCHAR            |
| reporter_id | INTEGER            |
| created_at  | TIMESTAMP          |
| updated_at  | TIMESTAMP          |

---

# Security Features

- Password hashing with bcrypt
- JWT token verification
- Protected private routes
- Role-based access control
- Environment variable protection
- Password excluded from responses

---

# Error Handling

The project includes:

- Centralized error handling middleware
- Consistent API response structure
- HTTP status code handling
- Validation error responses

---

# Standard API Response Format

## Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

## Error Response

```json
{
  "success": false,
  "message": "Something went wrong",
  "errors": {}
}
```

---

# Deployment

## Backend Hosting

- Vercel

## PostgreSQL Hosting

- NeonDB / Supabase / ElephantSQL

---

# Author

Developed for the DevPulse Assignment using:

- Express.js
- PostgreSQL
- TypeScript
- JWT Authentication
- Raw SQL Queries
