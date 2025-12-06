# EcoHome - Next.js Deployment Guide

## Overview

This application has been converted to Next.js with a serverless backend architecture that can be deployed on Vercel. It uses Prisma with Vercel Postgres for database management.

## Architecture

### Backend
- **Framework**: Next.js 16 App Router
- **Database**: Vercel Postgres (serverless PostgreSQL)
- **ORM**: Prisma
- **API Routes**: RESTful endpoints under `/api`

### Frontend
- **Framework**: Next.js with React 19
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **UI Components**: Lucide React icons, Recharts for visualizations

## Local Development

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   # Database URLs (for local development, use a local PostgreSQL or Vercel Postgres)
   POSTGRES_PRISMA_URL="postgresql://user:password@localhost:5432/ecohome?schema=public"
   POSTGRES_URL_NON_POOLING="postgresql://user:password@localhost:5432/ecohome?schema=public"

   # Optional: Google Gemini API key for AI advisor
   API_KEY="your_gemini_api_key"
   ```

3. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

4. **Run Database Migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Seed the Database**
   Start the dev server and make a POST request to seed initial data:
   ```bash
   npm run dev
   # In another terminal:
   curl -X POST http://localhost:3000/api/seed
   ```

6. **Access the Application**
   - Game: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## Vercel Deployment

### Step 1: Create a Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repository

### Step 2: Set Up Vercel Postgres

1. In your Vercel project dashboard, go to the "Storage" tab
2. Click "Create Database" → "Postgres"
3. Choose a database name (e.g., "ecohome-db")
4. Select a region close to your users
5. Click "Create"

Vercel will automatically:
- Create the Postgres database
- Add environment variables to your project:
  - `POSTGRES_PRISMA_URL`
  - `POSTGRES_URL_NON_POOLING`

### Step 3: Add Additional Environment Variables (Optional)

If you're using the AI advisor feature:

1. Go to "Settings" → "Environment Variables"
2. Add:
   - Key: `API_KEY`
   - Value: Your Google Gemini API key
   - Environments: Production, Preview, Development

### Step 4: Configure Build Settings

Vercel should auto-detect Next.js settings, but verify:

- **Framework Preset**: Next.js
- **Build Command**: `prisma generate && next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Step 5: Deploy

1. Click "Deploy"
2. Wait for the build to complete

### Step 6: Run Database Migration

After first deployment, run migrations:

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Link your project
vercel link

# Run migrations in production
vercel env pull .env.production
npx prisma migrate deploy
```

### Step 7: Seed the Database

Make a POST request to your production URL:

```bash
curl -X POST https://your-app.vercel.app/api/seed
```

## API Endpoints

### Products
- `GET /api/products` - Get all active products
- `POST /api/products` - Create a new product
- `GET /api/products/[id]` - Get a specific product
- `PUT /api/products/[id]` - Update a product
- `DELETE /api/products/[id]` - Soft delete a product

### Subsidies
- `GET /api/subsidies` - Get all active subsidies
- `POST /api/subsidies` - Create a new subsidy
- `GET /api/subsidies/[id]` - Get a specific subsidy
- `PUT /api/subsidies/[id]` - Update a subsidy
- `DELETE /api/subsidies/[id]` - Soft delete a subsidy

### Seed
- `POST /api/seed` - Initialize database with default products and subsidies

## Database Schema

The application uses 4 main tables:

1. **products** - Marketplace items (solar panels, batteries, etc.)
2. **subsidies** - Government incentives
3. **subsidy_types** - Many-to-many relationship between subsidies and product types
4. **audit_log** - Tracks all changes to products and subsidies

## Admin Panel

Access the admin panel at `/admin` to:
- Create, edit, and delete products
- Manage product prices, energy parameters, and descriptions
- Configure subsidies and which product types they apply to
- View all marketplace items in a dashboard

## Updating from Previous Version

The application has been migrated from:
- Vite → Next.js
- Hardcoded constants → Database-driven
- Client-only → Full-stack with API

Old data from `constants.ts` is automatically seeded when you run `/api/seed`.

## Troubleshooting

### Build Errors

**Error**: "Prisma Client not generated"
```bash
npx prisma generate
```

**Error**: "Database connection failed"
- Check your environment variables are correct
- Ensure Vercel Postgres database is created
- Verify the connection strings have the correct format

### Database Issues

**Reset database (development only)**:
```bash
npx prisma migrate reset
```

**View database in Prisma Studio**:
```bash
npx prisma studio
```

## Performance Considerations

- The Prisma Client is cached using Next.js global singleton pattern
- API routes use edge runtime for faster cold starts
- Database queries are optimized with proper indexing
- Soft deletes preserve data while hiding inactive items

## Security

- API routes should be protected with authentication in production
- Consider adding rate limiting to prevent abuse
- Use environment variables for all sensitive data
- Enable CORS restrictions for production deployments

## Monitoring

Use Vercel's built-in monitoring:
- View function logs in the Vercel dashboard
- Monitor database performance in Vercel Postgres dashboard
- Set up error tracking with Vercel integrations

## Support

For issues or questions:
- Check Vercel deployment logs
- Review Prisma documentation: https://www.prisma.io/docs
- Next.js documentation: https://nextjs.org/docs
