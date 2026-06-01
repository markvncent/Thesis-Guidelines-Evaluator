# React SPA / Dashboard — Project Framework & Folder Structure

A clean, scalable architecture for a general-purpose React single-page application or dashboard. No external state manager — just React's built-in `useState`, `useReducer`, and `Context API` where needed.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | React 18+ (Vite) |
| Styling | CSS Modules or Tailwind CSS |
| Routing | React Router v6 |
| Data fetching | Native `fetch` + custom hooks |
| State | `useState` / `useReducer` / Context |
| Linting | ESLint + Prettier |
| Build | Vite |

---

## Bootstrapping

```bash
npm create vite@latest my-dashboard -- --template react
cd my-dashboard
npm install
npm install react-router-dom
```

---

## Folder Structure

```
my-dashboard/
├── public/
│   └── favicon.ico
│
├── src/
│   ├── assets/                  # Static assets (images, fonts, icons)
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/              # Shared, reusable UI components
│   │   ├── ui/                  # Primitives: Button, Input, Badge, Modal
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Button.module.css
│   │   │   │   └── index.js
│   │   │   ├── Card/
│   │   │   └── Modal/
│   │   │
│   │   └── layout/              # Structural components: Sidebar, Navbar, Footer
│   │       ├── Sidebar/
│   │       │   ├── Sidebar.jsx
│   │       │   └── Sidebar.module.css
│   │       ├── Navbar/
│   │       └── PageWrapper/
│   │
│   ├── pages/                   # Top-level route pages
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Dashboard.module.css
│   │   │   └── index.js
│   │   ├── Analytics/
│   │   ├── Settings/
│   │   └── NotFound/
│   │
│   ├── features/                # Feature-specific components and logic
│   │   ├── charts/              # e.g. Chart widgets used on Dashboard
│   │   ├── tables/              # Data table components
│   │   └── widgets/             # Metric cards, summary panels, etc.
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useFetch.js          # Generic data fetching hook
│   │   ├── useLocalStorage.js   # Persist state to localStorage
│   │   └── useDebounce.js
│   │
│   ├── context/                 # React Context providers
│   │   ├── ThemeContext.jsx     # Light/dark mode
│   │   └── AuthContext.jsx      # Auth state if needed
│   │
│   ├── services/                # API call functions (no UI logic)
│   │   ├── api.js               # Base fetch wrapper / axios config
│   │   ├── dashboardService.js
│   │   └── userService.js
│   │
│   ├── utils/                   # Pure helper functions
│   │   ├── formatDate.js
│   │   ├── formatCurrency.js
│   │   └── classNames.js        # Utility for combining class names
│   │
│   ├── constants/               # App-wide constants
│   │   ├── routes.js            # Route path strings
│   │   └── config.js            # Env-based config values
│   │
│   ├── styles/                  # Global styles
│   │   ├── globals.css          # CSS reset, root variables
│   │   └── themes.css           # Color tokens, typography scale
│   │
│   ├── App.jsx                  # Root component + router setup
│   ├── main.jsx                 # ReactDOM.createRoot entry point
│   └── router.jsx               # Route definitions (React Router v6)
│
├── .env                         # Environment variables (never commit secrets)
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── vite.config.js
└── package.json
```

---

## Key File Templates

### `src/main.jsx`
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### `src/App.jsx`
```jsx
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ThemeProvider } from './context/ThemeContext'

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
```

### `src/router.jsx`
```jsx
import { createBrowserRouter } from 'react-router-dom'
import PageWrapper from './components/layout/PageWrapper'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PageWrapper />,        // Shared layout (Navbar + Sidebar)
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])
```

### `src/components/layout/PageWrapper/PageWrapper.jsx`
```jsx
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import styles from './PageWrapper.module.css'

export default function PageWrapper() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Navbar />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
```

### `src/hooks/useFetch.js`
```js
import { useState, useEffect } from 'react'

export function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) return
    let cancelled = false

    setLoading(true)
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(json => { if (!cancelled) setData(json) })
      .catch(err => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [url])

  return { data, loading, error }
}
```

### `src/context/ThemeContext.jsx`
```jsx
import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'))

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

### `src/services/api.js`
```js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
```

### `src/constants/routes.js`
```js
export const ROUTES = {
  HOME: '/',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
}
```

### `src/styles/globals.css`
```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --color-bg: #f8f9fb;
  --color-surface: #ffffff;
  --color-primary: #4f6ef7;
  --color-text: #1a1d23;
  --color-muted: #6b7280;
  --color-border: #e5e7eb;
  --radius: 8px;
  --shadow: 0 1px 4px rgba(0,0,0,0.08);
}

[data-theme='dark'] {
  --color-bg: #111318;
  --color-surface: #1c1f26;
  --color-text: #f1f3f7;
  --color-muted: #9ca3af;
  --color-border: #2d313a;
}

body {
  font-family: system-ui, sans-serif;
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
}
```

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | `UserCard.jsx` |
| Hooks | camelCase, `use` prefix | `useFetch.js` |
| Services | camelCase, `Service` suffix | `userService.js` |
| Contexts | PascalCase, `Context` suffix | `ThemeContext.jsx` |
| CSS Modules | `Component.module.css` | `Sidebar.module.css` |
| Constants | SCREAMING_SNAKE_CASE | `ROUTES`, `API_TIMEOUT` |
| Util functions | camelCase | `formatDate.js` |

---

## Component Co-location Rule

Each non-trivial component lives in its own folder:

```
Button/
├── Button.jsx          ← Component
├── Button.module.css   ← Scoped styles
└── index.js            ← Re-exports Button for clean imports
```

`index.js` content:
```js
export { default } from './Button'
```

This lets you import cleanly from anywhere:
```js
import Button from '@/components/ui/Button'
```

---

## Vite Path Alias (recommended)

In `vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

---

## Scripts

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint src --ext .js,.jsx",
  "format": "prettier --write src"
}
```

---

## Guiding Principles

1. **Co-locate by feature, not file type** — keep related files together in `features/` rather than scattering them across global folders.
2. **Pages are thin** — pages compose features and layout; business logic lives in hooks and services.
3. **Hooks own async logic** — never fetch inside a component body directly; always use a hook.
4. **Services are pure** — no React imports in `services/`; they only handle HTTP.
5. **Constants prevent magic strings** — centralise route paths, API endpoints, and config values.
