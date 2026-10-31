import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

import './styles/global.css'
import './styles/animations.css'
import './styles/portfolio.css'
import './styles/admin.css'

// Router basename follows Vite's base so the app works when
// deployed to GitHub Pages (/portfolio/), a domain root, or preview.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
