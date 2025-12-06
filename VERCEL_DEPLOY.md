# Vercel Deployment Guide

## Quick Deploy via Dashboard

### Step 1: Import Project
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select `aibymlMelissa/AIHome-Electrification`
4. Click "Import"

### Step 2: Configure Project
- **Project Name**: `aihome-electrification`
- **Framework**: Next.js (auto-detected)
- **Build Command**: Default (will use package.json)
- **Root Directory**: `./`

### Step 3: Skip Environment Variables (for now)
- Click "Deploy" without adding variables
- The first deployment will fail - this is expected

### Step 4: Add Vercel Postgres
1. Go to project → "Storage" tab
2. Click "Create Database" → "Postgres"
3. Name: `ecohome-db`
4. Click "Create"

This automatically adds:
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

### Step 5: Redeploy
1. Go to "Deployments" tab
2. Click "Redeploy" on the latest deployment
3. Wait for build to complete

### Step 6: Run Migrations
```bash
# Install Vercel CLI (if not already)
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull

# Run migrations in production
npx prisma migrate deploy
```

### Step 7: Seed Database
Visit your deployment URL:
```
https://your-app.vercel.app/api/seed
```

Or use curl:
```bash
curl -X POST https://your-app.vercel.app/api/seed
```

### Step 8: Access Your App
- **Game**: https://your-app.vercel.app
- **Admin Panel**: https://your-app.vercel.app/admin

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify Prisma client was generated

### Database Connection Errors
- Ensure Vercel Postgres is created
- Check environment variables are correct
- Run `vercel env pull` and verify `.env` file

### Migration Errors
- Ensure you're using `npx prisma migrate deploy` (not `migrate dev`)
- Check database permissions
- Verify schema.prisma is correct

## Alternative: CLI Deployment

If you prefer CLI:

```bash
# Navigate to project
cd /Users/aibyml.com/AIHomeElectrification

# Deploy (will prompt for project name)
vercel --prod

# When prompted:
# - Set up and deploy: Y
# - Scope: your-team
# - Link to existing project: N
# - Project name: aihome-electrification
# - Directory: ./
# - Override settings: N
```

## Post-Deployment Checklist

- [ ] App loads at production URL
- [ ] Database created and connected
- [ ] Migrations applied
- [ ] Database seeded
- [ ] Admin panel accessible (/admin)
- [ ] API endpoints working
- [ ] GitHub auto-deployment configured

## Environment Variables Reference

Required variables (auto-added by Vercel Postgres):
```
POSTGRES_PRISMA_URL=postgresql://...
POSTGRES_URL_NON_POOLING=postgresql://...
```

Optional:
```
API_KEY=your-gemini-api-key  # For AI advisor feature
```
