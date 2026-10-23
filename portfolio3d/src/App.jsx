import { lazy, Suspense } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Plain from './components/Plain.jsx'
import Reader from './components/Reader.jsx'

// three.js is loaded only when the 3D page is opened, so the plain site stays light
const Experience = lazy(() => import('./components/Experience.jsx'))

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch { return false }
}
const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// No WebGL or reduced motion -> the plain website, which has all the same content
function Home() {
  if (!hasWebGL() || prefersReduced()) return <Navigate to="/plain" replace />
  return <Suspense fallback={<p className="loading">Loading the comic world...</p>}><Experience /></Suspense>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/plain" element={<Plain />} />
      <Route path="/issue/:id/:page?" element={<Reader />} />
      <Route path="*" element={<main className="wrap"><h1>Page not found</h1><Link className="btn" to="/">Back home</Link></main>} />
    </Routes>
  )
}
