# 🔗 ZipUrl

> A full-stack URL Shortening System built to understand real-world system design concepts like encoding, caching, and request flow.

---

## 🚀 Live Demo

🔗 

---

## 📌 What is ZipUrl?

ZipUrl is a full-stack URL shortening application that converts long URLs into short, easy-to-share links.

This project is not just a basic shortener — it is built with a focus on system design and real-world architecture:

- Efficient short URL generation using Base62 encoding  
- Fast redirects using Redis caching  
- Reliable storage using PostgreSQL  
- A unique UI that shows what happens behind the scenes when a link is shortened  

The goal was to move beyond theory and understand how systems like Bitly actually work internally.

---

## ✨ Features

- 🔗 URL Shortening - Convert long URLs into compact short links  
- ⚡ Fast Redirects - Redis caching for quick response time  
- 🧠 Base62 Encoding - Generates short, unique, URL-friendly codes  
- 📊 Click Tracking - Tracks number of times a link is accessed  
- 🔁 302 Redirects - Flexible redirect strategy  
- 🎯 Behind-the-scenes UI - Visualizes request flow step-by-step  
- 🌙 Dark Mode UI - Clean React + Tailwind interface  
- 📱 Responsive Design - Works across devices  

---

## 🛠️ Tech Stack

| Layer | Technology | Why Used |
|------|-----------|---------|
| Frontend | React + Vite | Fast UI rendering and modern development |
| Styling | Tailwind CSS | Clean and responsive design |
| Backend | Node.js + Express | Scalable REST API |
| Database | PostgreSQL | Structured, relational data with strong consistency |
| ORM | Prisma | Type-safe queries and schema management |
| Caching | Redis (Cloud) | Faster redirects and reduced DB load |
| Encoding | Base62 | Compact and URL-safe short codes |

---

## 🧠 System Design Overview

### 🔄 URL Shortening Flow

1. User enters a long URL in the frontend  
2. Frontend sends request : `POST /api/shorten`  
3. Backend:
   - Validates URL  
   - Stores it in PostgreSQL  
   - Generates unique ID  
   - Converts ID : Base62 short code  
4. Short URL is returned to the user  

---

### 🔁 Redirect Flow

1. User opens short URL  
2. Backend checks Redis:
   - Cache HIT -> redirect immediately  
   - Cache MISS -> fetch from DB -> store in Redis  
3. Click count is incremented  
4. 302 redirect is sent to the original URL  

---

## 🔥 Unique Feature

### 👀 Behind-the-Scenes Visualization

Unlike traditional URL shorteners that act like a black box, ZipUrl shows:

- Request being sent  
- URL validation  
- Base62 encoding  
- Database storage  
- Cache usage  

This makes system behavior visible and easier to understand, especially for learning system design.

---

## 🗂️ Project Structure
```
zipurl/
├── frontend/
│ └── src/
│ ├── components/
│ ├── hooks/
│ ├── services/
│ ├── App.jsx
│ └── main.jsx
│
├── backend/
│ ├── controllers/
│ ├── routes/
│ ├── prisma/
│ │ └── schema.prisma
│ ├── redis/
│ ├── utils/
│ └── server.js

```


---

## Running Locally

### Prerequisites

- Node.js v18+
- PostgreSQL installed
- Redis (Cloud or local)
---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/zipurl.git
cd zipurl
```
### 2. Setup Backend

```
cd backend
npm install
```
### creare .env file 

```
DATABASE_URL=your_postgres_url
REDIS_URL=your_redis_url
BASE_URL=http://localhost:3000
```
### Run backend

```
npx prisma migrate dev
npm run dev
```
### 3. Setup Frontend

```
cd frontend
npm install
npm run dev
```

### open in browser
```
http://localhost:5173
```
## Key Learnings

# Understanding how URL shorteners work internally
# Choosing SQL (PostgreSQL) over NoSQL based on data structure
# Using Redis caching to improve performance
# Designing efficient short code generation using Base62
# Managing request flow across frontend and backend

## Why I Built This

While learning system design of a URL shortener, I realized that reading theory was not enough.
So I built ZipUrl to understand how data flows across layers, how caching improves performance, and how real-world systems are structured.

This project helped me move from theory to practical implementation.

## Future Improvements

# Custom aliases for URLs
# Expiry-based links
# Rate limiting
# Analytics dashboard


<p align="center">Built with ❤️ while learning system design</p> ```
