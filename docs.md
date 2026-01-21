# Nigerian Political Data Platform – Development Document

## 1. Project Overview

This platform is a civic data and political intelligence system focused on Nigerian politics. It provides transparent, AI-powered profiles, rankings, and analytics for politicians across all levels of government, enabling citizens, media, NGOs, and researchers to make informed decisions.

The system aggregates verified public data, applies scoring and ranking logic, and uses AI to continuously update and summarize political records.

---

## 2. Core Objectives

* Centralize Nigerian political data in one trusted platform
* Track performance, promises, and public records of politicians
* Rank politicians by office and performance metrics
* Enable citizens to search, filter, compare, and evaluate leaders
* Use AI to automate updates, summaries, and insights

---

## 3. User Roles

### 3.1 Public Users

* View politician profiles
* Search & filter politicians
* View rankings and scorecards
* Participate in opinion polls
* Read blogs and analysis
* Use AI Q&A assistant

### 3.2 Admin Users

* Manage politician records
* Verify AI-ingested data
* Manage rankings & metrics weights
* Moderate content and reports
* Publish blogs
* Manage ads and featured content

---

## 4. Platform Architecture

### Frontend

* Framework: React (Web)
* State Management: Redux / Zustand
* Styling: Tailwind CSS
* Routing: React Router

### Backend

* Runtime: Node.js
* Framework: Express.js / NestJS
* Database: Neon db PostgreSQL
* Search Engine: Elasticsearch
* Cache: Redis

### AI Layer

* Provider: OpenAI API
* Functions:

  * Profile generation & updates
  * Promise tracking summaries
  * News ingestion & structuring
  * AI Q&A assistant

### Admin Panel

* Framework: React
* Role-based access control
* Data moderation tools

---

## 5. Political Office Coverage

The platform must support rankings and profiles for:

* President / Vice President
* Governors / Deputy Governors
* Senators
* House of Representatives Members
* State House of Assembly Members
* Ministers
* Special Advisers & Appointees
* Ambassadors
* Local Government Chairmen
* Councillors

Each office has its own ranking category and scoring logic.

---

## 6. Politician Profile Structure

Each politician profile includes:

* Full name
* Photo
* Party affiliation
* Office(s) held
* Tenure periods
* State
* Constituency
* Local Government Area
* Biography
* Campaign promises
* Bills & motions
* Projects & initiatives
* Appointments & roles
* Public statements
* Controversies (verified only)
* Performance score
* Rank per category

Profiles are auto-updated by AI and verified by admins.

---

## 7. Geographic & Political Categorization

### Location Hierarchy

* Country: Nigeria
* State
* Senatorial District
* Federal Constituency
* State Constituency
* Local Government Area

Every politician must be mapped correctly across this hierarchy.

---

## 8. Ranking & Scoring System

### Ranking Logic

* Rankings are office-specific
* Each office has weighted metrics
* Scores range from 0–100

### Example Metrics

#### Senators

* Bills sponsored
* Attendance
* Oversight activities
* Constituency projects
* Promise fulfillment
* Public engagement

#### Governors

* Budget execution
* Infrastructure delivery
* Education & health impact
* Security improvements
* Transparency

Ranking recalculates automatically when new data is verified.

---

## 9. Search, Filter & Discovery

### Search Capabilities

* Name search
* Keyword search
* Office search

### Filters

* Office type
* State
* LGA
* Constituency
* Party
* Performance score range
* Integrity status

### Sorting

* Highest ranked
* Lowest ranked
* Most improved
* Most promises broken

---

## 10. Voting & Opinion Polls

* Non-official opinion polls
* Issue-based and performance-based questions
* Results broken down by state and region
* Historical trend analysis

---

## 11. AI Features

### 11.1 AI Data Ingestion

* Scrapes trusted news & public sources
* Converts unstructured data into structured records
* Flags conflicts for admin review

### 11.2 AI Profile Updates

* Automatically updates politician profiles
* Tracks changes in office or appointments

### 11.3 AI Q&A Assistant

* Answers user questions about politicians
* Uses verified platform data only
* Always cites sources

---

## 12. Backend API Modules

* Auth & Roles
* Politicians
* Offices
* Tenures
* Rankings & Scores
* Locations
* Polls
* Blogs
* AI Services
* Ads
* Audit Logs

All endpoints must be versioned (e.g. /api/v1).

---

## 13. Database Models (High-Level)

* User
* Admin
* Politician
* Office
* Tenure
* Location
* Promise
* Bill
* Project
* Score
* Ranking
* Poll
* Vote
* Blog
* Source
* AuditLog

---

## 14. Admin Panel Requirements

* Dashboard overview
* Politician data management
* AI ingestion review queue
* Ranking weight configuration
* Poll creation & moderation
* Blog management
* Ad management
* User & role management

---

## 15. Security & Trust

* Role-based access control
* Audit trails for all edits
* Source citation enforcement
* No anonymous data edits
* Clear ranking methodology page

---

## 16. MVP Scope

Phase 1:

* Senators, Governors, House of Reps
* Profiles + rankings
* Search & filters
* AI summaries
* Admin verification

Phase 2:

* Ministers & appointees
* LG Chairmen
* Citizen reports
* Advanced analytics

---

## 17. Non-Functional Requirements

* Scalable architecture
* Fast search (<300ms)
* High availability
* GDPR & data compliance
* Nigeria-focused data sources

---

## 18. Success Metrics

* Monthly active users
* Search usage
* Profile views
* Media citations
* Poll participation

---

This document is the single source of truth for all frontend, backend, AI, and admin development.
