<div align="center">

# PIXORA·

**An editorial-grade social platform for sharing images with intention.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![ImageKit](https://img.shields.io/badge/ImageKit-Media%20CDN-orange?style=flat-square)](https://imagekit.io)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)

</div>

---

## What is Pixora?

Pixora is a full-stack social media platform inspired by Instagram, built with a dark editorial aesthetic. Users register, share images with captions, like and comment on posts, follow other creators, and curate their own saved collection — all behind JWT-authenticated, protected routes.

The UI takes cues from editorial photography magazines: a near-black canvas (`#0D0D0F`), amber accents, Playfair Display for headings, and Manrope for UI text. Every interaction has motion via Framer Motion.

---

## Features

**Authentication**
- Register with username, email, and password
- Login with email or username
- JWT stored in HTTP cookies; session restored from `localStorage` on page reload
- Protected routes — unauthenticated users are redirected to `/login`

**Posts**
- Upload images directly from the browser (via ImageKit CDN)
- Add a caption to every post
- Feed shows the 30 most recent posts from all users, sorted newest first
- Post detail page with full image, like/save status, and comment thread

**Social Graph**
- Follow and unfollow other users
- Follower and following counts shown on every profile
- Click-through modals to browse followers/following lists
- Guard against self-follow on both frontend and backend

**Likes & Saves**
- Like or unlike any post with instant optimistic UI update
- Save posts to a personal collection; accessible from the "Saved" tab on your profile
- Unique indexes in MongoDB prevent duplicate likes/saves

**Comments**
- Add comments to any post
- Comments load with author profile image and username
- Sorted newest-first

**Profiles**
- View your own profile or any other user's profile at `/user/:username`
- Edit your bio inline via a modal
- 3-column photo grid with hover zoom effect
- Toggle between "Posts" and "Saved" tabs (Saved is private — only shown on own profile)

**UI & UX**
- Responsive layout: sidebar nav on desktop, bottom tab bar on mobile
- Framer Motion page transitions and staggered post animations
- Floating action button (FAB) to create a post from anywhere in the feed
- Toast notifications for actions
- Loader component for async states

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router v7, Framer Motion, Axios, SCSS + Tailwind CSS v4 |
| Backend | Node.js, Express 5 |
| Database | MongoDB via Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs, cookie-parser |
| Media | ImageKit (image upload + CDN delivery) |
| Form handling | React Hook Form |
| Build tool | Vite 7 |
| Dev server | Nodemon |

---

## Project Structure

```
Pixora/
├── Backend/
│   ├── server.js                  # Entry point — starts Express, connects to DB
│   └── src/
│       ├── app.js                 # App config: CORS, middleware, route mounting
│       ├── config/
│       │   └── database.js        # Mongoose connection
│       ├── controllers/
│       │   ├── auth.controller.js # register, login
│       │   ├── post.controller.js # CRUD, feed, likes, saves, comments
│       │   └── user.controller.js # follow, unfollow, profile, bio, lists
│       ├── middlewares/
│       │   └── auth.middleware.js # JWT cookie verification → req.user
│       ├── models/
│       │   ├── user.model.js
│       │   ├── post.model.js
│       │   ├── likes.model.js     # Compound unique index (post + user)
│       │   ├── comment.model.js
│       │   ├── follow.model.js    # Compound unique index (follower + followee)
│       │   └── save.model.js      # Compound unique index (post + user)
│       └── routes/
│           ├── auth.routes.js
│           ├── post.routes.js
│           └── user.routes.js
│
└── Frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx                # Router setup with protected routes
        ├── main.jsx
        ├── api/
        │   └── axios.js           # Axios instance (baseURL + withCredentials)
        ├── context/
        │   └── AuthContext.jsx    # Global auth state, login/register/logout
        ├── components/
        │   ├── Navbar.jsx         # Desktop sidebar + mobile bottom tab bar
        │   ├── PostCard.jsx       # Feed card with image, author, like, comment, save
        │   ├── LikeButton.jsx
        │   ├── SaveButton.jsx
        │   ├── FollowButton.jsx
        │   ├── ImageUploader.jsx
        │   ├── Modal.jsx
        │   ├── Loader.jsx
        │   ├── Toast.jsx
        │   ├── ProtectedRoute.jsx
        │   └── PageTransition.jsx
        └── pages/
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── FeedPage.jsx
            ├── PostDetailPage.jsx
            ├── UploadPage.jsx
            └── ProfilePage.jsx    # Own profile + other user profile + followers/following modals
```

---

## API Reference

All routes are prefixed with `/api`. Protected routes require a valid JWT in the `token` cookie.

### Auth — `/api/auth`

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/register` | `username, email, password, bio?, profileImage?` | Register a new user |
| POST | `/login` | `email? or username, password` | Login; sets JWT cookie |

### Posts — `/api/posts`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | ✅ | Create a post (`multipart/form-data`: `img` + `caption`) |
| GET | `/` | ✅ | Get all posts by the authenticated user |
| GET | `/feed` | ✅ | Get 30 most recent posts (all users), with like/save/comment stats |
| GET | `/details/:postId` | ✅ | Get a single post with full stats |
| POST | `/like/:postid` | ✅ | Like a post |
| POST | `/unlike/:postid` | ✅ | Unlike a post |
| POST | `/comment/:postId` | ✅ | Add a comment (`{ text }`) |
| GET | `/comment/:postId` | ✅ | Get all comments for a post |
| POST | `/save/:postId` | ✅ | Save a post |
| POST | `/unsave/:postId` | ✅ | Unsave a post |
| GET | `/saved` | ✅ | Get all saved posts for the authenticated user |

### Users — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/profile/:username` | ✅ | Get profile info + posts + follow stats |
| POST | `/profile/bio` | ✅ | Update bio (`{ bio }`) |
| POST | `/follow/:username` | ✅ | Follow a user |
| POST | `/unfollow/:username` | ✅ | Unfollow a user |
| GET | `/profile/:username/followers` | ✅ | Get followers list |
| GET | `/profile/:username/following` | ✅ | Get following list |

---

## Database Schema

**users** — `username` (unique), `email` (unique), `password` (hidden by default), `bio`, `profileImage`

**posts** — `caption`, `imgURL`, `user` (ref → users)

**likes** — `post` (ref → posts), `user` (username string) — compound unique index

**comments** — `text`, `post` (ref → posts), `user` (username string) — with timestamps

**follows** — `follower` (username), `followee` (username) — compound unique index, with timestamps

**saves** — `post` (ref → posts), `user` (username string) — compound unique index, with timestamps

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- ImageKit account (free tier works fine)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/pixora.git
cd pixora
```

### 2. Backend setup

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

> Get your ImageKit private key from the ImageKit dashboard → Developer → API Keys.

Start the backend dev server:

```bash
npm run dev
# Server runs at http://localhost:3000
```

### 3. Frontend setup

```bash
cd ../Frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

> The frontend Axios instance points to `http://localhost:3000/api` by default. If you change the backend port, update `Frontend/src/api/axios.js`.

---

## Environment Variables

| Variable | Where | Description |
|---|---|---|
| `MONGO_URI` | Backend `.env` | MongoDB Atlas connection string |
| `JWT_SECRET` | Backend `.env` | Secret key for signing/verifying JWTs |
| `IMAGEKIT_PRIVATE_KEY` | Backend `.env` | ImageKit private API key for server-side uploads |

---

## Deployment Notes

**Backend (Render / Railway)**
- Set all three environment variables in the hosting dashboard
- Change the CORS `origin` in `src/app.js` to your deployed frontend URL before deploying
- The `public/` folder in Backend serves the built frontend as a static SPA fallback

**Frontend (Vercel / Netlify)**
- Run `npm run build` to produce `dist/`
- Update `baseURL` in `Frontend/src/api/axios.js` to your deployed backend URL
- Ensure the deployment platform is configured to serve `index.html` for all routes (SPA routing)

---

## Known Limitations & Potential Improvements

- No pagination on the feed (currently capped at 30 posts)
- Cookies are not `httpOnly` — a future improvement for XSS hardening
- No image compression before upload
- No search functionality
- No notifications system
- Profile images are set at registration and cannot be updated through the UI

---

## License

MIT — use freely, build on top of it, give credit if you'd like.

---

<div align="center">
  Built with React, Express, MongoDB, and ImageKit · Dark by design
</div>
