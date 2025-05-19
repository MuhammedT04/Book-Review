Book Review API
A RESTful API for a Book Review system built with Node.js, Express, TypeScript, and MongoDB.  



Features

User Authentication

JWT-based authentication
User registration and login


Book Management

Add new books (authenticated users only)
Get all books with pagination
Filter books by author and genre
Get detailed book information including average rating


Reviews

Submit reviews for books (authenticated users only)
One review per user per book limitation
Update and delete your own reviews


Search

Search books by title or author (partial and case-insensitive)



Database Schema
The application uses MongoDB with Mongoose as the ODM (Object Document Mapper). Below is the schema design:


User
{
  userName: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed)
}
Book
{
  title: String (required),
  author: String (required),
  description: String (required),
  genre: [String] (required),
  averageRating:  Number,
  createdBy: ObjectId (ref: User, required),
}
Review
{
  book: ObjectId (ref: Book, required),
  user: ObjectId (ref: User, required),
  rating: Number (required, 1-5),
  comment: String (required),
}

Constraints:

The Review schema has a compound index on { book: 1, user: 1 } with a unique constraint to ensure a user can only review a book once.
The Book schema has a text index on title and author fields to enable text search


Prerequisites

Node.js (v14+)
MongoDB (local or Atlas)
npm or yarn

Installation

Clone the repository:

bashgit clone https://github.com/yourusername/book-review-api.git
cd book-review-api

Install dependencies:

bashnpm install
# or
yarn install

Build the TypeScript code:

bashnpm run build
# or
yarn build
Environment Variables
Create a .env file in the root directory with the following variables:
PORT=7000
MONGODB_URI=mongodb://localhost:27017/book-review-api
ACCESS_TOKEN_SECRET=4d@a$R!eT93h%Zs8uUWxLmq0*QKp7zJ^
REFRESH_TOKEN_SECRET=wERt!98Kv$Rm2YzPjLxFq7%V3BpS1d$
JWT_SECRET=books
NODE_ENV=development


API Documentation
Authentication
Register a new user
POST /api/auth/signup
Request body:
json{
  "userName": "muhammed",
 "email": "muh@gmail.com",
  "password": "Mhdt$0407"
}
Login
POST /api/auth/login
Request body:
json{
  "email": "muh@gmail.com",
  "password": "Mhdt$0407"
}


Books
Add a new book (Authentication required)
POST /books
Request body:
json{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "description": "A novel about the American Dream...",
  "genre": "Fiction",
  "averageRating": 2,
}
Get all books (with pagination and optional filters)
GET /books?page=1&limit=10&author=Tolkien&genre=Fantasy
Get book details by ID
GET /books/:id
Search books
GET /books/search?q=gatsby

Reviews
Submit a review for a book (Authentication required)
POST /books/:id/reviews
Request body:
json{
  "rating": 5,
  "comment": "One of the best books I've ever read!"
}
Update your review (Authentication required)
PUT /reviews/:id
Request body:
json{
  "rating": 4,
  "comment": "Updated thoughts after a second reading."
}
Delete your review (Authentication required)
DELETE /reviews/:id


Example API Requests
Using cURL
Register a new user
bashcurl -X POST http://localhost:7000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"userName":"muhammed","email":"muh@gmail.com","password":"Mhdt$0407"}'
Login
bashcurl -X POST http://localhost:7000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"muh@gmail.com","password":"Mhdt$0407"}'
Add a new book
bashcurl -X POST http://localhost:7000/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"The Great Gatsby","author":"F. Scott Fitzgerald","description":"A novel about the American Dream...","genre":"Fiction","averageRating":2}'
Get all books
bashcurl -X GET http://localhost:7000/books?page=1&limit=10
Get book details
bashcurl -X GET http://localhost:7000/books/BOOK_ID

Using Postman

Register a User:

Method: POST
URL: http://localhost:7000/auth/signup
Headers: Content-Type: application/json
Body (raw JSON):
json{
  "username": "muhammed",
  "email": "muh@gmail.com",
  "password": "Mhdt$0407"
}



Login:

Method: POST
URL: http://localhost:7000/auth/login
Headers: Content-Type: application/json
Body (raw JSON):
json{
  "email": "muh@gmail.com",
  "password": "Mhdt$0407"
}

Save the returned JWT token for authenticated requests


Add a Book:

Method: POST
URL: http://localhost:7000/books
Headers:

Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN


Body (raw JSON):
json{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "description": "A novel about the American Dream...",
  "genre": ["Fiction", "Classic"],
 
}



Search Books:

Method: GET
URL: http://localhost:7000/books/search?q=gatsby


Submit a Review:

Method: POST
URL: http://localhost:7000/books/BOOK_ID/reviews
Headers:

Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN


Body (raw JSON):
json{
  "rating": 5,
  "comment": "One of the best books I've ever read!"
}
