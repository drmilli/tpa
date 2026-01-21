# The Peoples Affairs - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend Layer                        │
├─────────────────────────────────────────────────────────────┤
│  Public Web App (React)        │  Admin Panel (React)        │
│  - User Interface              │  - Data Management          │
│  - Search & Browse             │  - Content Moderation       │
│  - Politician Profiles         │  - Analytics Dashboard      │
│  - Polls & Voting              │  - User Management          │
└─────────────────┬──────────────┴──────────────┬──────────────┘
                  │                              │
                  │  REST API (JSON)             │
                  │                              │
┌─────────────────┴──────────────────────────────┴──────────────┐
│                      Backend API Layer                         │
├─────────────────────────────────────────────────────────────┬─┤
│  Express.js Server                                           │
│  ┌───────────────┬────────────────┬──────────────────────┐  │
│  │ Auth Module   │ Politicians    │ Rankings & Scores    │  │
│  │ - JWT         │ - CRUD Ops     │ - Calculations       │  │
│  │ - RBAC        │ - Profiles     │ - Leaderboards       │  │
│  └───────────────┴────────────────┴──────────────────────┘  │
│  ┌───────────────┬────────────────┬──────────────────────┐  │
│  │ Polls         │ Blogs          │ Locations            │  │
│  │ - Voting      │ - Publishing   │ - States/LGAs        │  │
│  │ - Results     │ - Categories   │ - Hierarchy          │  │
│  └───────────────┴────────────────┴──────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                  │
                  │
┌─────────────────┴───────────────────────────────────────────┐
│                    Data & Services Layer                      │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ PostgreSQL   │  │ Redis Cache  │  │ Elasticsearch│      │
│  │ - Primary DB │  │ - Sessions   │  │ - Search     │      │
│  │ - Prisma ORM │  │ - Rate Limit │  │ - Indexing   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │ OpenAI API   │  │ File Storage │                         │
│  │ - AI Summary │  │ - Images     │                         │
│  │ - Analysis   │  │ - Documents  │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Search**: Elasticsearch
- **Authentication**: JWT
- **Validation**: express-validator
- **Logging**: Winston

### Frontend (Public)
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios

### Admin Panel
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Authentication**: JWT with Role-Based Access

## Database Schema

### Core Entities

#### User & Authentication
- `User` - Platform users (public)
- Roles: USER, ADMIN, MODERATOR

#### Political Structure
- `State` - Nigerian states
- `SenatorialDistrict` - Senatorial districts
- `LocalGovernment` - LGAs
- `Office` - Political offices (President, Governor, Senator, etc.)
- `Politician` - Individual politicians
- `Tenure` - Office tenure records

#### Performance & Tracking
- `Promise` - Campaign promises
- `Bill` - Bills sponsored/co-sponsored
- `Project` - Projects initiated
- `Statement` - Public statements
- `Controversy` - Verified controversies
- `Metric` - Performance metrics per office
- `Score` - Individual metric scores
- `Ranking` - Overall rankings

#### Engagement
- `Poll` - Opinion polls
- `Vote` - Poll votes
- `Blog` - Blog posts

#### System
- `Source` - Data sources
- `AuditLog` - System audit trail

## API Architecture

### RESTful API Design

```
/api/v1
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /refresh
│   └── POST /logout
│
├── /politicians
│   ├── GET /
│   ├── GET /search
│   ├── GET /:id
│   ├── GET /:id/profile
│   ├── POST / (auth)
│   ├── PUT /:id (auth)
│   └── DELETE /:id (auth)
│
├── /offices
│   ├── GET /
│   ├── GET /:id
│   ├── POST / (auth)
│   ├── PUT /:id (auth)
│   └── DELETE /:id (auth)
│
├── /rankings
│   ├── GET /
│   ├── GET /office/:officeId
│   └── GET /politician/:politicianId
│
├── /polls
│   ├── GET /
│   ├── GET /:id
│   ├── GET /:id/results
│   ├── POST /:id/vote
│   ├── POST / (auth)
│   ├── PUT /:id (auth)
│   └── DELETE /:id (auth)
│
├── /blogs
│   ├── GET /
│   ├── GET /:slug
│   ├── POST / (auth)
│   ├── PUT /:id (auth)
│   └── DELETE /:id (auth)
│
└── /locations
    ├── GET /states
    ├── GET /states/:stateId/lgas
    └── GET /states/:stateId/senatorial-districts
```

## Authentication & Authorization

### JWT-Based Authentication
- Access tokens (7 days expiry)
- Refresh tokens (30 days expiry)
- Tokens stored in localStorage (client-side)

### Role-Based Access Control (RBAC)
- **USER**: Browse, vote, read content
- **MODERATOR**: Create/edit politician data, verify AI-ingested data
- **ADMIN**: Full system access, user management, system configuration

### Security Measures
- Password hashing with bcrypt (12 rounds)
- Rate limiting on auth endpoints
- CORS configuration
- Helmet.js security headers
- Input validation and sanitization

## Performance Optimization

### Caching Strategy
- Redis for:
  - Session management
  - API response caching
  - Rate limiting counters
  - Temporary data storage

### Search Optimization
- Elasticsearch for:
  - Fast full-text search
  - Fuzzy matching
  - Faceted search
  - Real-time indexing

### Database Optimization
- Indexed fields for common queries
- Pagination for large datasets
- Eager loading for related data
- Connection pooling

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Session data in Redis
- Load balancer ready

### Vertical Scaling
- Database connection pooling
- Query optimization
- Caching layers

### Future Enhancements
- Microservices architecture
- Message queue (RabbitMQ/Kafka)
- CDN for static assets
- Database read replicas

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│            Load Balancer                 │
└────────┬───────────────────┬─────────────┘
         │                   │
    ┌────┴────┐         ┌────┴────┐
    │ App     │         │ App     │
    │ Server 1│         │ Server 2│
    └────┬────┘         └────┬────┘
         │                   │
         └────────┬──────────┘
                  │
         ┌────────┴──────────┐
         │                   │
    ┌────┴────┐         ┌────┴────┐
    │PostgreSQL│        │  Redis  │
    │ Primary  │        │ Cluster │
    └──────────┘        └─────────┘
```

## Monitoring & Logging

### Application Logging
- Winston for structured logging
- Log levels: error, warn, info, debug
- Log rotation and archival

### Monitoring Metrics
- API response times
- Database query performance
- Cache hit/miss rates
- Error rates
- User activity

### Audit Trail
- All data modifications logged
- User actions tracked
- IP address and user agent captured
