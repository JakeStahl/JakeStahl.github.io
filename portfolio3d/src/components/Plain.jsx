import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { issues, profile } from '../data/site.js'
import { Page } from './Pages.jsx'

// In-page scrolling uses buttons, not #anchors, because HashRouter owns the URL hash
const go = id => document.getElementById(id)?.scrollIntoView({
  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
})

// The "normal website": one scrolling page with every piece of information
export default function Plain() {
  useEffect(() => { document.title = 'Jake Stahl | Software Developer' }, [])
  return (
    <div className="plain" id="top">
      <header className="pl-top">
        <button className="pl-brand" onClick={() => go('top')}>{profile.name}</button>
        <nav className="pl-nav" aria-label="Sections">
          {issues.map(i => <button key={i.id} className="pl-link" onClick={() => go(`s-${i.id}`)}>{i.title}</button>)}
        </nav>
        <Link className="btn" to="/">3D comic world</Link>
      </header>

      <section className="pl-hero">
        <h1>{profile.name}</h1>
        <p className="role">{profile.role}</p>
        <p className="pl-pitch">{profile.pitch}</p>
        <div className="links">
          <a className="btn red" href={profile.resume} target="_blank" rel="noopener noreferrer">Download resume</a>
          <a className="btn" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <button className="btn" onClick={() => go('s-2')}>See my projects</button>
        </div>
      </section>

      {issues.map((s, k) => (
        <section key={s.id} id={`s-${s.id}`} className={`pl-sec${k % 2 ? ' alt' : ''}`}>
          <div className="pl-in">
            <h2 className="pl-h">{s.title}</h2>
            <div className="pl-pages">
              {s.pages.map((p, i) => (
                <div className="pl-page pg" key={i}><Page p={p} hideHeading={p.heading === s.title} /></div>
              ))}
            </div>
          </div>
        </section>
      ))}
      <footer className="pl-foot">Built with React and three.js. Hosted free on GitHub Pages.</footer>
    </div>
  )
}
