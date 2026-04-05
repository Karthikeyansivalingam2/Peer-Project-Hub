# 🚀 Final Deployment Walkthrough

All frontend code has been refactored to use a centralized API configuration. Follow these final steps to go live.

## 1. Cloud Database (Action Required)
Your backend still needs a cloud database connection string.
- Setup a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Copy the connection string.
- Update `backend/.env` with `MONGO_URI=your_link`.

## 2. Deploy Backend (Action Required)
Since your app is full-stack, the backend must be hosted separately.
- Host the `backend/` folder on **Render.com** or **Railway.app**.
- Copy the production URL (e.g., `https://peer-hub-api.onrender.com`).

## 3. Configure Vercel (Action Required)
To fix the "Network Error":
1. Log in to **Vercel Dashboard**.
2. Go to **Settings** -> **Environment Variables**.
3. Add a new variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api` (End with `/api`)
4. **Redeploy**: Push your current changes to GitHub or trigger a manual redeploy in Vercel.

## ✅ What's Fixed?
- [x] Removed all `http://localhost:5001` references.
- [x] Centralized API logic in `frontend/src/utils/api.js`.
- [x] Updated all 10 frontend pages & components to use production-ready calls.
- [x] Provisioned `deployment_guide.md` in the project root for reference.

---
**Note:** If using Render's free tier, the first load after inactivity might take a minute as the server "wakes up".
