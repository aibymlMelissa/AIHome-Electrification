# Deploy to Vercel - Quick Guide

## 🚀 Option 1: Use the Deploy Script (Easiest)

I've created a helper script for you. Just run:

```bash
./deploy.sh
```

Then answer the prompts:
- **Scope**: `aibymlcom-8896`
- **Link to existing**: `N`
- **Project name**: `aihome-electrification`
- **Directory**: `./` (press Enter)
- **Override settings**: `N`

---

## 🖥️ Option 2: Manual CLI Commands

### First Time Setup

```bash
vercel
```

**When prompted, answer:**

1. **Set up and deploy?** → `Y`
2. **Which scope?** → `aibymlcom-8896`
3. **Link to existing?** → `N`
4. **Project name?** → `aihome-electrification`
5. **Code directory?** → `./` (just press Enter)
6. **Override settings?** → `N`

### After First Deployment

For subsequent deployments:

```bash
vercel --prod
```

---

## 📋 What Happens Next

1. **Build Process** (2-5 minutes)
   - Installs dependencies
   - Generates Prisma client
   - Builds Next.js application
   - Deploys to Vercel

2. **First Deployment URL**
   - You'll get a preview URL like: `https://aihome-electrification-xxx.vercel.app`
   - Production URL: `https://aihome-electrification.vercel.app`

3. **Expected Build Error** ⚠️
   - **First build WILL FAIL** - this is normal!
   - Reason: No database connection yet
   - We'll fix this in the next step

---

## 🗄️ After First Deploy: Set Up Database

### Step 1: Go to Vercel Dashboard
```
https://vercel.com/aibymlcom-8896/aihome-electrification
```

### Step 2: Create Postgres Database
1. Click **"Storage"** tab
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Name: `ecohome-db`
5. Region: Choose closest to your users
6. Click **"Create"**

### Step 3: Vercel Auto-Adds Environment Variables
Vercel automatically adds:
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

### Step 4: Redeploy
1. Go to **"Deployments"** tab
2. Click **"Redeploy"** on latest deployment
3. Or run: `vercel --prod` again

---

## 🔧 Run Database Migrations

After successful deployment with database:

```bash
# Pull environment variables from Vercel
vercel env pull

# Run migrations
npx prisma migrate deploy
```

---

## 🌱 Seed the Database

### Method 1: Via Browser
Visit:
```
https://aihome-electrification.vercel.app/api/seed
```

### Method 2: Via cURL
```bash
curl -X POST https://aihome-electrification.vercel.app/api/seed
```

You should see:
```json
{"message":"Database seeded successfully"}
```

---

## ✅ Verify Deployment

### 1. Test Main App
```
https://aihome-electrification.vercel.app
```
You should see the EcoHome game interface.

### 2. Test Admin Panel
```
https://aihome-electrification.vercel.app/admin
```
You should see products and subsidies loaded.

### 3. Test API
```bash
curl https://aihome-electrification.vercel.app/api/products
```
Should return JSON array of products.

---

## 🔄 Future Deployments

After initial setup, deployments are automatic:

1. **Push to GitHub** → Automatic deployment
2. **Or run**: `vercel --prod` → Manual deployment

---

## 🐛 Troubleshooting

### Build Fails: "Prisma Client not found"
```bash
# Ensure postinstall script runs
npm run postinstall
git add package.json
git commit -m "Fix Prisma client generation"
git push
```

### Build Fails: "Database connection failed"
- Ensure Vercel Postgres is created
- Check environment variables are set
- Redeploy after adding database

### Migrations Fail
```bash
# Reset and try again
vercel env pull
npx prisma migrate deploy
```

### Seed Fails
- Ensure migrations ran successfully
- Check database is empty (first seed only)
- Verify API endpoint is accessible

---

## 📊 Post-Deployment Checklist

- [ ] App deployed successfully
- [ ] Database created and connected
- [ ] Migrations applied
- [ ] Database seeded
- [ ] Main app loads (`/`)
- [ ] Admin panel works (`/admin`)
- [ ] Products visible in marketplace
- [ ] Settings work (resell to grid, etc.)
- [ ] Automatic deployments configured

---

## 🎯 Quick Reference

**Deploy**: `./deploy.sh` or `vercel`
**Production**: `vercel --prod`
**Pull env**: `vercel env pull`
**Migrations**: `npx prisma migrate deploy`
**Seed**: Visit `/api/seed` endpoint

---

## 🆘 Need Help?

1. Check build logs in Vercel dashboard
2. Review `DEPLOYMENT.md` for detailed guide
3. Check Vercel documentation: https://vercel.com/docs

---

**Ready to deploy? Run: `./deploy.sh`**
