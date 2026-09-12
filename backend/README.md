# KRISHIQ Backend

This backend provides the REST API for the KRISHIQ agriculture marketplace.

## Features

- Authentication and role-based authorization
- Product catalog management
- Orders and payments
- Farmer, buyer, FPO, logistics and admin support
- Notifications and AI service abstractions
- Cloudinary image uploads
- MongoDB integration with Mongoose

## Setup

1. Copy `.env.example` to `.env` and fill in your environment variables.
2. Install dependencies:

   npm install

3. Start the development server:

   npm run dev

4. Production start:

   npm start

## Environment variables

See `.env.example` for the full list. The most important one is `MONGODB_URI`.

If `MONGODB_URI` is not set, the backend will still start locally and serve the health endpoint, but it will not connect to a live MongoDB instance.

## API routes

- `/api/auth`
- `/api/products`
- `/api/orders`
- `/api/buyers`
- `/api/farmers`
- `/api/fpo`
- `/api/logistics`
- `/api/ai`
- `/api/payment`

## Health check

- `GET /api/health`

## Docker

```bash
docker build -t krishiq-backend .
docker run -p 5000:5000 --env-file .env krishiq-backend
```