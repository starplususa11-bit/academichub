# AcademicHub

A full-stack academic management platform built with **React + Vite** (frontend) and **Express + MongoDB** (backend).

## Project Structure

```
academichub/
├── .vscode/          # VS Code workspace settings
├── api/              # Vercel serverless functions
├── backend/          # Express.js REST API server
│   ├── config/       # DB & config files
│   ├── controllers/  # Route controllers
│   ├── data/         # Seed/static data
│   ├── middleware/   # Auth, rate limiter middleware
│   ├── routes/       # API routes
│   ├── services/     # Business logic services
│   ├── uploads/      # Uploaded files
│   └── server.js     # Entry point
├── frontend/         # React + Vite client app
│   ├── public/       # Static assets
│   └── src/
│       ├── components/
│       ├── context/
│       ├── layouts/
│       ├── pages/
│       ├── services/
│       └── styles/
├── package.json      # Root monorepo scripts
└── vercel.json       # Vercel deployment config
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Install root dependencies
npm install

# Install backend dependencies
npm install --prefix backend

# Install frontend dependencies
npm install --prefix frontend
```

### Development

```bash
# Run both frontend & backend concurrently
npm run dev

# Run backend only
npm run backend

# Run frontend only
npm run frontend
```

### URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/health

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 19, Vite, TailwindCSS       |
| Backend  | Express.js, MongoDB, Mongoose     |
| Auth     | JWT, bcryptjs                     |
| AI       | Google Generative AI              |
| Deploy   | Vercel                            |
