# The Peoples Affairs

A civic data and political intelligence platform for Nigerian politics, providing transparent, AI-powered profiles, rankings, and analytics for politicians across all levels of government.

## Project Structure

```
tpa/
├── backend/          # Node.js/Express backend API
├── frontend/         # React web application
├── admin/           # React admin panel
├── shared/          # Shared types and utilities
└── docs.md          # Project documentation
```

## Tech Stack

### Backend
- Node.js & Express.js
- PostgreSQL (Neon DB)
- Prisma ORM
- Redis (caching)
- Elasticsearch (search)
- OpenAI API (AI features)

### Frontend
- React 18
- Redux Toolkit
- Tailwind CSS
- React Router
- Axios

### Admin Panel
- React 18
- Redux Toolkit
- Tailwind CSS
- Role-based access control

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis
- Elasticsearch

### Installation

1. Clone the repository
2. Install dependencies:
```bash
cd backend && npm install
cd ../frontend && npm install
cd ../admin && npm install
```

3. Set up environment variables (see `.env.example` in each directory)

4. Run database migrations:
```bash
cd backend && npm run migrate
```

5. Start development servers:
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev

# Admin
cd admin && npm run dev
```

## Environment Variables

See `.env.example` files in each directory for required configuration.

## Documentation

Full project documentation is available in [docs.md](./docs.md)

## License

MIT
