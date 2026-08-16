# Annadata — Multivendor Agricultural Marketplace

> **Kisan se Grahak Tak** — Connecting farmers directly to consumers

[![Server](https://img.shields.io/badge/Server-Spring%20Boot%204-6db33f?style=flat-square&logo=spring)](./server)
[![Client](https://img.shields.io/badge/Client-React%2019%20+%20Vite-61dafb?style=flat-square&logo=react)](./client)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk)](./server)
[![MySQL](https://img.shields.io/badge/Database-MySQL%208-4479A1?style=flat-square&logo=mysql)](https://www.mysql.com/)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start (Local Development)](#quick-start-local-development)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Database Schema & ER Diagram](./DATABASE.md)
- [Complete API Documentation](./API_DOCUMENTATION.md)
- [Contributing](./CONTRIBUTING.md)
- [Security](./SECURITY.md)

---

## Overview

Annadata is a full-stack multivendor e-commerce platform designed for the Indian agricultural market. It enables farmers (sellers) to list and sell their produce directly to consumers, with support for delivery personnel management, admin oversight, and AI-powered features.

**User Roles:**
| Role | Description |
|---|---|
| **Customer / Buyer** | Browse products, place orders, track deliveries |
| **Seller / Farmer** | List produce, manage inventory, view earnings |
| **Admin** | Platform management, commissions, analytics |
| **Delivery** | Accept and fulfill delivery assignments |

---

## Architecture

```
┌─────────────────────┐     HTTPS / JSON     ┌──────────────────────────┐
│   Client (Frontend) │◄────────────────────►│   Server (Backend)       │
│   (Vite + React TS) │                       │   (Spring Boot REST API) │
│   Port 5173 (dev)   │                       │   Port 5454              │
│   Port 80 (prod)    │                       │                          │
│                     │                       │   JWT Auth (stateless)   │
│                     │                       │   Spring Security        │
└─────────────────────┘                       └──────────┬───────────────┘
                                                         │
                                                         ▼
                                              ┌──────────────────────────┐
                                              │      MySQL 8 Database    │
                                              │      (Port 3306)         │
                                              └──────────────────────────┘
```

**Proxy setup (dev):** Vite proxies all `/api`, `/auth`, `/sellers`, `/admin`, `/delivery`, `/seller`, `/home`, `/ai` routes to Spring Boot server on port 5454, avoiding CORS issues during development.

---

## Features

- JWT-based authentication (separate tokens for buyers, sellers, delivery, admin)
- Product catalog with category browsing
- Cart, checkout, and order management
- Dual payment gateway: **Razorpay** (Indian) + **Stripe** (International)
- Email OTP verification via Gmail SMTP
- AI-powered features via **Google Gemini API**
- Delivery assignment and tracking
- Commission management for admin
- Multilingual support (i18next)
- Progressive Web App (PWA) — installable on mobile

---

## Project Structure

```
Annadata/
├── server/                         # Spring Boot Backend Server
│   ├── src/main/java/com/zosh/
│   │   ├── config/                 # Security, JWT, CORS config
│   │   ├── controller/             # REST controllers
│   │   ├── service/                # Business logic
│   │   ├── repository/             # JPA repositories
│   │   ├── model/                  # JPA entities
│   │   ├── dto/                    # Data transfer objects
│   │   ├── domain/                 # Enums / domain types
│   │   ├── exception/              # Global exception handling
│   │   └── ai/                     # Gemini AI integration
│   ├── src/main/resources/
│   │   └── application.properties  # Config (reads from env vars)
│   ├── .env.example                # ⬅ Copy this to .env with real values
│   ├── Dockerfile
│   └── pom.xml
│
├── client/                         # React + Vite Frontend Client
│   ├── src/
│   │   ├── admin/                  # Admin dashboard
│   │   ├── seller/                 # Seller dashboard
│   │   ├── customer/               # Customer pages
│   │   ├── delivery/               # Delivery dashboard
│   │   ├── components/             # Shared components
│   │   ├── Redux Toolkit/          # Redux state management
│   │   ├── Config/                 # Axios instance + API helpers
│   │   ├── routes/                 # Route definitions
│   │   └── types/                  # TypeScript types
│   ├── .env.example                # ⬅ Copy this to .env with real values
│   ├── Dockerfile
│   ├── nginx.conf                  # Production Nginx config
│   └── vite.config.ts
│
├── docker-compose.yml              # Local dev with Docker
└── README.md
```

---

## Prerequisites

| Tool | Version | Download |
|---|---|---|
| **Java JDK** | 21+ | [Eclipse Temurin](https://adoptium.net/) |
| **Maven** | 3.9+ (or use `./mvnw`) | [Maven](https://maven.apache.org/) |
| **Node.js** | 20+ | [Node.js](https://nodejs.org/) |
| **MySQL** | 8.0+ | [MySQL](https://dev.mysql.com/downloads/) |
| **Docker** _(optional)_ | Latest | [Docker Desktop](https://www.docker.com/products/docker-desktop/) |

---

## Quick Start (Local Development)

### Option A — Without Docker

#### 1. Database Setup

```sql
-- Run in MySQL
CREATE DATABASE annadata CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 2. Backend Server Setup

```bash
cd server

# Copy and fill the env template
cp .env.example .env
# Edit .env with your values

# OR use the Spring properties file
cp src/main/resources/application-dev.properties.example \
   src/main/resources/application-dev.properties
# Edit application-dev.properties with your local values

# Run the backend server
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

The server starts on **http://localhost:5454**

#### 3. Frontend Client Setup

```bash
cd client

# Copy and fill the env template
cp .env.example .env
# Edit .env — set VITE_API_URL=http://localhost:5454

# Install dependencies
npm install

# Start dev server
npm run dev
```

The client starts on **http://localhost:5173**

---

### Option B — With Docker Compose

```bash
# 1. Fill in server environment
cp server/.env.example server/.env

# 2. Fill in client environment
cp client/.env.example client/.env

# 3. Start all services
docker compose up -d

# 4. View logs
docker compose logs -f
```

Services:
- Client (Frontend): http://localhost
- Server (Backend): http://localhost:5454
- Database (MySQL): localhost:3306

---

## Environment Variables

### Server (`server/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No (default: 5454) | Server port |
| `DB_HOST` | No (default: localhost) | MySQL host |
| `DB_PORT` | No (default: 3306) | MySQL port |
| `DB_NAME` | No (default: annadata) | Database name |
| `DB_USERNAME` | **Yes** | MySQL username |
| `DB_PASSWORD` | **Yes** | MySQL password |
| `JWT_SECRET` | **Yes** | JWT signing secret (min 64 chars) |
| `JWT_EXPIRY_MS` | No (default: 86400000) | Token expiry in ms (24h) |
| `MAIL_USERNAME` | **Yes** | Gmail address for OTP emails |
| `MAIL_PASSWORD` | **Yes** | Gmail App Password |
| `STRIPE_SECRET_KEY` | **Yes** | Stripe secret key (`sk_...`) |
| `RAZORPAY_KEY_ID` | **Yes** | Razorpay key ID (`rzp_...`) |
| `RAZORPAY_KEY_SECRET` | **Yes** | Razorpay key secret |
| `GEMINI_API_KEY` | **Yes** | Google Gemini API key |
| `FRONTEND_URL` | No (default: http://localhost:5173) | Frontend URL (for CORS) |

> **Generating a JWT Secret:**
> ```bash
> openssl rand -hex 64
> ```

### Client (`client/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | **Yes** | Backend API base URL |
| `VITE_RAZORPAY_KEY_ID` | **Yes** | Razorpay public key ID |
| `VITE_STRIPE_PUBLISHABLE_KEY` | **Yes** | Stripe publishable key (`pk_...`) |

---

## Deployment

### Railway + Vercel (Recommended)

#### Server (Backend) → Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select `server/` as root directory
3. Add a **MySQL** plugin from Railway marketplace
4. Set all environment variables from the table above in Railway's Variables tab
5. Railway auto-detects Spring Boot and builds with Maven

#### Client (Frontend) → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import `client/`
2. Set root directory to `client`
3. Add environment variables:
   - `VITE_API_URL` = your Railway backend server URL
   - `VITE_RAZORPAY_KEY_ID` = your Razorpay public key
   - `VITE_STRIPE_PUBLISHABLE_KEY` = your Stripe publishable key
4. Deploy

> **After deploying server**, update `FRONTEND_URL` in Railway to your Vercel client URL, and update `VITE_API_URL` in Vercel to your Railway server URL.

---

### Docker (VPS / Self-hosted)

```bash
# On your server
git clone https://github.com/your-org/annadata.git
cd annadata

# Setup env
cp server/.env.example server/.env
nano server/.env   # Fill real values

cp client/.env.example client/.env
nano client/.env   # Fill real values

# Build and run
docker compose up -d --build
```

---

## API Overview

All API endpoints are served from the backend server at port 5454.

| Prefix | Description | Auth Required |
|---|---|---|
| `POST /auth/signup` | Customer registration | No |
| `POST /auth/signin` | Customer login | No |
| `GET /api/products/**` | Browse products | No |
| `GET /api/home/**` | Homepage data | No |
| `POST /api/orders` | Place order | Customer JWT |
| `GET /api/cart` | View cart | Customer JWT |
| `/sellers/**` | Seller management | Seller JWT |
| `/admin/**` | Admin operations | Admin JWT |
| `/delivery/**` | Delivery operations | Delivery JWT |
| `/ai/**` | AI chat assistant | JWT |

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

---

## Security

If you discover a security vulnerability, please see [SECURITY.md](./SECURITY.md).
