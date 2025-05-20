# 📚 Book Review API

## 🛠️ Tech Stack
- Node.js with Express.js
- PostgreSQL using Sequelize ORM
- JWT for authentication

## 🚀 Setup Instructions
1. Install dependencies:
```bash
npm install
```
2. Configure your `.env` file with:
```
PORT=3000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret
```

```bash
```
3. Set Up PostgreSQL Database
Ensure PostgreSQL is installed and running. Then create the database:
```

```
createdb bookdb
You can also use a GUI tool like pgAdmin or run this in psql:
```

```
CREATE DATABASE bookdb;
```

3. Start the server:
```bash
npm run dev
```

## 🔐 Auth Endpoints
- POST `/signup`
- POST `/login`

## 📘 Book Endpoints
- POST `/books`
- GET `/books`
- GET `/books/:id`
- POST `/books/:id/reviews`
- PUT `/reviews/:id`
- DELETE `/reviews/:id`
- GET `/search`

## 💾 Database Schema
- Users: id, username, password
- Books: id, title, author, genre
- Reviews: id, userId, bookId, rating, comment


## 📘Example APIs
bash 
# Signup
curl -X POST http://localhost:3000/signup -H "Content-Type: application/json" -d '{"username":"john@gmail.com","password":"123456"}'

# Login
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username":"john@gmail.com","password":"123456"}'

# Add a Book (requires Bearer token)
curl -X POST http://localhost:3000/books -H "Authorization: Bearer YOUR_JWT_TOKEN" -H "Content-Type: application/json" -d '{"title":"Clean Code","author":"Robert C. Martin","genre":"Programming"}'

# Get Books (with optional filters and pagination )
curl "http://localhost:3000/books?page=1&limit=10&author=Robert&genre=Programming"

# Get Book By ID 
http://localhost:3000/books/1?page=1&limit=1

# Add Review to Book (requires Bearer token)
curl -X POST http://localhost:3000/books/1/reviews -H "Authorization: Bearer YOUR_JWT_TOKEN" -H "Content-Type: application/json" -d '{"rating":5,"comment":"Great book!"}'

# Update Review (requires Bearer token)
curl -X PUT http://localhost:3000/reviews/1 -H "Authorization: Bearer YOUR_JWT_TOKEN" -H "Content-Type: application/json" -d '{"rating":4,"comment":"Updated comment"}'

# Delete Review (requires Bearer token)
curl -X DELETE http://localhost:3000/reviews/1 -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Search Books
curl "http://localhost:3000/search?byAuthorbyTitle=clean"
