# Developer Portfolio — React + Firebase

A premium, production-quality developer portfolio with a hidden, cloud-powered
admin panel (a lightweight CMS). React + Vite on the front, **Firebase
Authentication + Firestore** as the only backend.

```
Visitor ──▶ Portfolio ──▶ READ  projects (Firestore, real-time)
Admin   ──▶ /admin    ──▶ WRITE projects (Firebase Auth + Firestore)
```

Firestore is the **single source of truth** — no localStorage/sessionStorage,
no hardcoded data arrays, no custom backend. Projects added in the admin panel
persist across browsers, devices, and deployments.

---

## Features

| Area | Details |
| --- | --- |
| Public site | Hero, About, Skills, Experience, Projects, Contact, Footer — with scroll reveals, staggered entrances and a responsive CSS grid (3 / 2 / 1 columns) |
| Admin panel | Hidden at `/admin`, guarded by Firebase Authentication (Email/Password). Full CRUD: add, edit, delete, preview, live project count |
| Real-time | Firestore `onSnapshot` listeners — edits made in the admin appear on the portfolio instantly, in every browser |
| States | Skeleton loading, friendly error states with retry, thoughtful empty states |
| Security | Public can only **read** projects; writes require an authenticated account (see `firestore.rules`) |

## Quick start

### 1. Install

```bash
npm install
```

### 2. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**.
2. **Firestore Database**: Build → Firestore Database → Create database (production mode).
3. **Authentication**: Build → Authentication → Sign-in method → enable **Email/Password**.
4. Add your admin account under **Authentication → Users → Add user** (this is
   how you sign in at `/admin` — there is no hardcoded password anywhere).
5. Paste the rules from [`firestore.rules`](./firestore.rules) into
   **Firestore → Rules → Publish**.

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill the `VITE_FIREBASE_*` values from **Project settings → General → Your apps → Web app → Config**.
These client values are safe to expose in a browser — access control is enforced
by Firebase Authentication + Firestore Security Rules, not by hiding keys.

### 4. Run

```bash
npm run dev        # http://localhost:5173/portfolio/
npm run build      # production build
npm run preview    # preview the build
```

### 5. Connect the security rules (CLI, optional)

```bash
npm i -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

## Personal info

Everything personal lives in one file: [`src/data/profile.js`](./src/data/profile.js).
Replace the `[YOUR NAME]`, `[YOUR EMAIL]`, etc. placeholders once and the whole
site updates. Note: the hero title also reads SEO meta from `index.html`.

## Project structure

```
src/
├── firebase/          # config.js · auth.js · firestore.js — the only backend
├── data/profile.js    # centralized profile / skills / experience content
├── hooks/             # useProjects (Firestore) · useAuth · useScrollReveal
├── components/        # Navbar, Hero, About, Skills, Projects, ProjectCard,
│                      # Experience, Contact, Footer, ProtectedRoute, …
├── admin/             # ProjectForm · ConfirmDialog
├── pages/             # Home · AdminLogin · AdminDashboard
├── styles/            # global.css · animations.css · portfolio.css · admin.css
├── App.jsx
└── main.jsx
```

## Deployment

Works on **Vercel**, **Netlify**, **Firebase Hosting**, or **GitHub Pages**
(currently configured, `npm run deploy`). Remember to add the same
`VITE_FIREBASE_*` environment variables in your host's dashboard, and to add a
SPA redirect rule (`/admin` → `/`) if your host doesn't do it automatically.

## Acceptance tests (works as advertised)

- Add a project in `/admin` → it appears on the portfolio live.
- Hard refresh, new browser, another device → still there (Firestore, not browser storage).
- Delete → removed from Firestore and from every client.
- `/admin` unauthenticated → login screen only; public navigation has no admin link.
