# Peer Project Hub

A modern, premium SaaS-style web application where students can discover, share, and showcase coding projects. Built with React and styled with Framer Motion animations and Tailwind CSS.

## ✨ Features

### Modern UI/UX
- **Premium SaaS Design**: Glassmorphism effects, gradient backgrounds, and smooth animations
- **Interactive Components**: Hover effects, scale animations, and smooth transitions
- **Responsive Layout**: Perfectly optimized for desktop (3 columns), tablet (2 columns), and mobile (1 column)
- **Dark Mode Support**: Full dark mode theme with smooth transitions
- **Animated Hero Section**: Gradient text, floating elements, and call-to-action buttons

### Core Features
- User authentication with Firebase
- Create, read, update, and delete projects
- Search and filter projects by tags
- Project discovery feed with trending section
- Comments and community engagement
- Like/favorite projects
- User profiles and project management

## 🎨 Design System

### Color Palette
- **Primary Gradient**: Indigo to Purple (667eea → 764ba2)
- **Accent Colors**: Blue and Purple
- **Background**: Premium gradients with glassmorphism effects
- **Dark Mode**: Sophisticated dark indigo and purple tones

### Typography
- **Primary Font**: Poppins (UI elements, headings)
- **Secondary Font**: Inter (body text)
- **Font Weights**: 400–900 for hierarchy

### Components
- **Navbar**: Sticky, glassmorphic with dark mode toggle
- **Hero Section**: Large gradient heading with animated background
- **Project Cards**: Glass-effect cards with hover animations and glow effect
- **Search Bar**: Glassmorphic with tag filters
- **Trending Section**: Featured projects showcase
- **Empty States**: Illustrated and friendly messages

## 🛠 Tech Stack

### Frontend
- React 18.2
- React Router DOM 6.8
- Tailwind CSS 3.2
- Framer Motion 12.38 (animations)
- Axios 1.3
- Firebase 9.17

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Firebase Authentication

## 📦 Setup

### 1. Prerequisites
- Node.js installed
- MongoDB running locally or Atlas connection string
- Firebase project created

### 2. Backend Setup
```bash
cd backend
npm install
# Update MongoDB URI in .env if needed
npm run seed  # Seed sample data
npm run dev   # Start server (port 5003)
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Update Firebase config in src/utils/firebase.js
npm run dev   # Start dev server (port 5173)
```

### 4. Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Get your config from Project Settings
5. Update `frontend/src/utils/firebase.js`:
```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // ... other fields
};
```

## 📱 Responsive Grid Layout

- **Desktop**: 3 columns with 32px gap
- **Tablet (768px)**: 2 columns
- **Mobile (640px)**: 1 column, full width
- **Padding**: 16px on mobile, 32px on desktop

## 🎬 Animation Features

- **Fade-in**: Hero section and project cards on load
- **Hover Scale**: Project cards scale up on hover with glow
- **Stagger**: Cards appear sequentially with delays
- **Transitions**: Smooth color and transform transitions
- **Loading**: Animated skeleton screens

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Render/Railway)
```bash
# Set environment variables
# DATABASE_URL=your_mongodb_uri
# PORT=5003
npm run dev
```

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/projects | Get all projects |
| POST | /api/projects | Create new project |
| GET | /api/projects/:id | Get project details |
| GET | /api/projects/:id/comments | Get project comments |
| POST | /api/projects/:id/comments | Add comment |
| POST | /api/auth/register | Sync user with Firebase |

## 🎯 Future Enhancements

- [ ] Advanced search with Elasticsearch
- [ ] Recommendation engine
- [ ] Social features (follow, messaging)
- [ ] Project collaboration tools
- [ ] Analytics dashboard
- [ ] Deployment status tracking
- [ ] GitHub integration

## 📝 License

MIT License