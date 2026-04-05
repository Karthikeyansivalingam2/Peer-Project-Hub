# Deployment & Cloud DB Setup Guide

This guide outlines the steps to resolve the "Network Error" on Vercel and transition to a cloud database.

## 1. Cloud Database Setup (MongoDB Atlas)

Currently, your backend uses a local MongoDB. To work in production, you need a cloud instance.

1.  **Create Cluster**: Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free Shared Cluster.
2.  **Network Access**: Go to "Network Access" in the sidebar and click **"Add IP Address"**. For development/testing, click **"Allow Access from Anywhere"** (0.0.0.0/0).
3.  **Database User**: Go to "Database Access" and create a user with a password.
4.  **Get Link**: Click **"Connect"** on your Cluster -> **"Drivers"** -> Copy the connection string.
    *   *Example:* `mongodb+srv://user:pass@cluster0.mongodb.net/peer-project-hub?...`

## 2. Backend Environment Setup

Update your `backend/.env` file with the new URI:

```env
MONGO_URI=your_atlas_connection_string_here
PORT=5001
FIREBASE_PROJECT_ID=peer-project-hub-2
```

## 3. Fixing the "Network Error" on Vercel

The error occurs because your frontend is trying to talk to `localhost:5001`.

### Code Changes (Already partially done)
I have created a centralized API instance in `frontend/src/utils/api.js` and updated core pages (`Home`, `Login`, `Signup`). 

**Remaining Pages to update:**
You should replace `axios.get('http://localhost:5001/api/...')` with `api.get('/...')` in:
- `ProjectsPage.jsx`
- `ProjectDetail.jsx`
- `MyProjectsPage.jsx`
- `BookmarksPage.jsx`
- `ProfilePage.jsx`
- `EditProject.jsx`
- `CreateProject.jsx`

### Deployment Configuration
1.  **Deploy Backend**: Host your `backend` folder on [Render.com](https://render.com) or [Railway.app](https://railway.app).
2.  **Set Vercel Variables**:
    *   Open Vercel Dashboard -> Your Project -> **Settings** -> **Environment Variables**.
    *   Add **Key:** `VITE_API_URL`
    *   Add **Value:** `https://your-backend-url.onrender.com/api` (End with `/api` as per the code)
3.  **Redeploy**: Push your changes to GitHub. Vercel will pick them up and it will work.

> [!IMPORTANT]
> If you are using Render's free tier, the first request might take 30-60 seconds to "wake up" the server. This is normal.
