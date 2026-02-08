# Vercel Deployment Guide

This guide will help you deploy both your frontend and backend to Vercel.

## Prerequisites

- [Vercel Account](https://vercel.com) (sign up with GitHub)
- [Git](https://git-scm.com/) installed
- Your project pushed to GitHub

## Important: Database Setup

**SQLite won't work on serverless functions.** You need a cloud database that persists data across requests.

### Recommended: PostgreSQL on Vercel

**Recommended Database Services:**
1. **Vercel Postgres** (easiest, integrated)
2. **Neon** (free tier available)
3. **Railway.app**
4. **Heroku Postgres**

### Using Vercel Postgres (Recommended)

1. Go to https://vercel.com/dashboard
2. Create a new project and select your GitHub repository
3. In the "Storage" tab, add Postgres
4. Vercel will automatically add the `DATABASE_URL` environment variable
5. The code is already configured to use it!

## Step 1: Update Environment Variables

Create a `.env.local` file in your **frontend** directory:

```env
REACT_APP_API_URL=https://your-domain.vercel.app
```

**Note:** Replace `your-domain.vercel.app` with your actual Vercel deployment domain after the first deploy.

## Step 2: Configure Backend Routes

The backend routes are already set up to work with Vercel serverless functions:
- Routes are still in `backend/routes.js`
- Models support both SQLite (local) and PostgreSQL (production)
- The API handler is in `/api/index.js`

## Step 3: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
vercel
```

Follow the prompts:
- Link to existing project or create new
- Set production domain if prompted

### Option B: Using GitHub Integration

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Configure:
   - **Framework:** Create React App
   - **Build Command:** `cd frontend && npm run build`
   - **Output Directory:** `frontend/build`
5. Add environment variables:
   - `DATABASE_URL`: (from Vercel Postgres or your service)
   - `FRONTEND_URL`: Your Vercel deployment domain
6. Click "Deploy"

## Step 4: Initialize Database (One-Time)

After deployment, you need to sync the database schema:

1. In Vercel dashboard, go to your project
2. Click "Functions" to view the logs
3. The database will auto-sync on first request to `/api/*`
4. Or manually trigger: visit `https://your-domain.vercel.app/health`

To seed sample data, run locally:

```bash
# Set DATABASE_URL to your production database
set DATABASE_URL=your_postgres_url
node backend/seed.js
```

## Step 5: Update Frontend API URL

After deployment:

1. Get your Vercel deployment domain (e.g., `my-app.vercel.app`)
2. Update `.env.local`:
   ```env
   REACT_APP_API_URL=https://my-app.vercel.app
   ```
3. Redeploy frontend

## Environment Variables Needed

### Production (Vercel)
- `DATABASE_URL` - PostgreSQL connection string from Vercel Postgres
- `FRONTEND_URL` - Your Vercel domain (for CORS)

### Local Development
- None needed! Defaults to SQLite and `http://localhost:3000`

## Testing Deployment

After deployment, test these endpoints:

```bash
# Health check
curl https://your-domain.vercel.app/health

# Get all items
curl https://your-domain.vercel.app/items

# Sign up (create a user)
curl -X POST https://your-domain.vercel.app/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is set in Vercel environment variables
- Check database firewall allows Vercel IPs (usually automatic for Vercel Postgres)
- Check logs: `vercel logs <project-name>`

### Frontend Can't Connect to Backend
- Ensure `REACT_APP_API_URL` is set correctly
- Check CORS configuration in `api/index.js`
- Frontend should be on same domain (no localhost)

### Migration from SQLite to PostgreSQL

If you have existing SQLite data, you can:

1. Export from SQLite
2. Import to PostgreSQL, or
3. Update your seed script with existing data and re-run

Example migration:
```bash
# Extract data from SQLite
sqlite3 backend/ecommerce.db ".dump" > data.sql

# Then manually import relevant data to PostgreSQL
```

## Local Development

Local development still uses SQLite and doesn't require environment variables:

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm start
```

Visit `http://localhost:3000` - it will connect to `http://localhost:8080` automatically.

## Redeploying

Any push to your main/master branch on GitHub will trigger a new Vercel deployment automatically.

To deploy manually:
```bash
vercel --prod
```

## File Structure Summary

```
├── vercel.json            # Vercel configuration
├── .vercelignore          # Files to ignore during deploy
├── api/
│   └── index.js           # Serverless function entry point
├── backend/
│   ├── models.js          # Updated for PostgreSQL support
│   ├── routes.js          # API routes (unchanged)
│   ├── middleware.js      # Auth middleware
│   ├── server.js          # Local server (dev only)
│   ├── seed.js            # Database seeding
│   └── package.json       # Added pg driver
├── frontend/
│   ├── src/
│   │   └── App.js         # Updated to use env variables
│   └── package.json
└── README.md
```

## Next Steps

1. ✅ Database: Set up PostgreSQL (Vercel Postgres recommended)
2. ✅ Code: Already updated to support both SQLite and PostgreSQL
3. ✅ Config: `vercel.json` created with correct build settings
4. 🔄 Deploy: Push to GitHub or use Vercel CLI
5. 🔄 Configure: Add environment variables in Vercel dashboard
6. 🔄 Test: Verify API is working with the health endpoint
7. 🔄 Update Frontend: Set `REACT_APP_API_URL` after getting domain

## Support

For issues:
- Check Vercel docs: https://vercel.com/docs
- View logs: `vercel logs <project-name>`
- Check database service documentation
