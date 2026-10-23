import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles.css'

// HashRouter (#/issue/2/3) keeps deep links working on GitHub Pages, which has no server-side routing
createRoot(document.getElementById('root')).render(
  <HashRouter><App /></HashRouter>
)
