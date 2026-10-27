<div align="center">

<img src="https://img.shields.io/badge/ZipURL-Live-4f46e5?style=for-the-badge&logo=vercel&logoColor=white" alt="Live" />

# ZipURL

**A fast, minimal URL shortener — built with a real production stack.**

[**🔗 Live Demo →**](https://zipurl1.vercel.app)

<br />

![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Upstash-DC382D?style=flat-square&logo=redis&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

</div>

---

## Overview

ZipURL takes any long URL and converts it into a compact short link using **Base62 encoding** of an auto-incremented PostgreSQL ID. Every redirect is cached in **Redis** so subsequent visits are served in microseconds — no database hit needed.

The frontend walks users through the processing pipeline step-by-step: request → validate → encode → store → cache → done.

---

## Features

- **Instant shortening** — paste a URL, get a short link in under a second
- **Redis caching** — cache-hit redirects bypass the database entirely
- **Click tracking** — every visit increments a click counter asynchronously
- **Stats endpoint** — query any short code for click count, creation date, and original URL
- **Dark mode** — system preference aware, persisted to localStorage
- **20/20 automated tests** — full test suite covering every API route and Redis behaviour
- **Graceful degradation** — app works even if Redis is temporarily unavailable

---

## System Architecture

```
User
 │
 ├─► POST /api/shorten
 │     └─► Validate URL
 │     └─► INSERT into PostgreSQL (gets auto-increment ID)
 │     └─► Base62-encode the ID → shortCode
 │     └─► UPDATE record with shortCode
 │     └─► Return { shortUrl }
 │
 └─► GET /:shortCode
       └─► Check Redis cache
             ├─► HIT  → redirect 302, increment clicks (async)
             └─► MISS → lookup in PostgreSQL
                         └─► Store in Redis (TTL 1hr)
                         └─► redirect 302, increment clicks (async)
```

---

## Tech Stack

| Layer | Technology | Hosted On |
|---|---|---|
| Frontend | React 19 + Vite 7 + Tailwind CSS 4 | Vercel |
| Backend | Node.js 20 + Express 5 | Render |
| Database | PostgreSQL via Prisma ORM | Neon (serverless) |
| Cache | Redis | Upstash (REST API) |
| Icons | Lucide React | — |

---

## Project Structure

```
url-shortener/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Url model — id, originalUrl, shortCode, clickCount
│   │   └── migrations/
│   ├── src/
│   │   ├── app.js                 # Express app, CORS, routes
│   │   ├── server.js              # Entry point
│   │   ├── controllers/
│   │   │   ├── shorten.controller.js   # POST /api/shorten
│   │   │   ├── redirect.controller.js  # GET /:shortCode
│   │   │   └── stats.controller.js     # GET /api/stats/:shortCode
│   │   ├── routes/
│   │   ├── prisma/client.js       # Singleton Prisma client
│   │   ├── redis/client.js        # Upstash Redis (graceful degradation)
│   │   └── utils/
│   │       ├── base62.js          # BigInt ↔ Base62 encode/decode
│   │       └── validateUrl.js
│   └── test.js                    # Full test suite (20 tests)
│
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── UrlInput.jsx        # Input + Shorten button
    │   │   ├── FlowSteps.jsx       # Processing pipeline UI
    │   │   ├── ShortUrlResult.jsx  # Result card — Copy/Visit/New link
    │   │   └── DarkModeToggle.jsx  # Sun/Moon toggle
    │   ├── hooks/
    │   │   └── useShortenFlow.js   # State machine for the pipeline animation
    │   ├── pages/
    │   │   └── RedirectHandler.jsx # Catches /:shortCode, redirects via backend
    │   └── services/
    │       └── api.js              # fetch wrapper for POST /api/shorten
    └── index.html
```

---

## API Reference

### `POST /api/shorten`
Shorten a URL.

**Request**
```json
{ "url": "https://example.com/very/long/path" }
```

**Response** `201`
```json
{ "shortUrl": "https://your-domain.com/aB3" }
```

**Errors**
- `400` — missing or invalid URL

---

### `GET /:shortCode`
Redirect to the original URL. Checks Redis first, falls back to PostgreSQL.

**Response** — `302 Redirect` to original URL  
**Errors** — `404` if not found

---

### `GET /api/stats/:shortCode`
Get stats for a short link.

**Response** `200`
```json
{
  "shortCode": "aB3",
  "originalUrl": "https://example.com/very/long/path",
  "clickCount": 42,
  "createdAt": "2026-10-26T13:37:44.356Z",
  "expiresAt": null
}
```

**Errors** — `404` if not found

---

## Local Development

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database (free)
- An [Upstash](https://upstash.com) Redis instance (free)

### 1. Clone

```bash
git clone https://github.com/Amolraut638/url-shortener.git
cd url-shortener
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
DATABASE_URL="postgresql://user:pass@host/dbname?sslmode=require"
PORT=3000
BASE_URL=http://localhost:3000
UPSTASH_REDIS_REST_URL="https://your-instance.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"
```

Run migrations and start:

```bash
npx prisma migrate deploy
node src/server.js
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Start:

```bash
npm run dev
```

App is available at **http://localhost:5173**

---

## Running Tests

```bash
cd backend
node test.js
```

The test suite covers 20 assertions across all modules:

```
PostgreSQL  — Write / Read / Delete
Redis       — SET / GET hit / GET miss
Shorten API — HTTP 201 + shortUrl returned
Validation  — Invalid URL returns 400
Stats API   — All fields present
Redirect    — DB miss → 302 → Redis warm
Redirect    — Cache HIT → 302
Click count — Increments correctly
404         — Unknown code returns 404 (not crash)

Total: 20 passed, 0 failed ✅
```

---

## Deployment

| Service | Platform | Notes |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | Set `VITE_API_BASE_URL` to your backend URL |
| Backend | [Render](https://render.com) | Set all env vars, uses `npm start` |
| Database | [Neon](https://neon.tech) | Free serverless PostgreSQL |
| Redis | [Upstash](https://upstash.com) | Free REST Redis, 10K req/day |

**Important** — Update `BASE_URL` in backend env to your actual production URL so generated short links use the right domain.

---

## How Base62 Encoding Works

Each URL inserted into PostgreSQL gets an auto-incremented `BIGINT` ID. That integer is encoded into a Base62 string (characters `0-9a-zA-Z`) which becomes the short code.

```
ID 1    →  "1"
ID 10   →  "a"
ID 62   →  "10"
ID 3844 →  "100"
```

The alphabet is sorted numerics-first so short codes stay short and unambiguous. Decoding reverses the process to look up the original record — no separate lookup table needed.

---

## License

MIT — free to use, modify, and deploy.

---

<div align="center">

Made by [Amol Raut](https://github.com/Amolraut638)

[🔗 zipurl1.vercel.app](https://zipurl1.vercel.app)

</div>
