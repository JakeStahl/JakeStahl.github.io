import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { issues, profile } from '../data/site.js'
import { Page, titleOf } from './Pages.jsx'

/* A comic you flip through. Each "leaf" is a sheet of paper with a front and a back.
   The URL holds f = how many leaves have been turned, so every spread has its own link. */
const pad = n => String(n).padStart(2, '0')

// Narrow screens show one page at a time instead of a two-page spread
function useSingle() {
  const q = '(max-width:760px)'
  const [single, setSingle] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setSingle(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return single
}

function buildSheets(issue, single) {
  const sheets = [{ kind: 'cover' }, ...(single ? [] : [{ kind: 'inside' }]), ...issue.pages.map(p => ({ kind: 'page', p }))]
  if (!single && (sheets.length + 1) % 2) sheets.push({ kind: 'blank' }) // keep the back cover on a back face
  sheets.push({ kind: 'back' })
  return sheets
}

function Sheet({ s, issue, jump }) {
  const next = issues.find(i => i.id === issue.id + 1)
  switch (s.kind) {
    case 'cover':
      return (
        <div className={`cv c-${issue.color}`}>
          <span className="cv-num">ISSUE #{pad(issue.id)}</span>
          <h1>{issue.title}</h1>
          <p>{issue.tagline}</p>
          <span className="cv-by">Story and code by {profile.name}</span>
        </div>
      )
    case 'inside':
      return (
        <div className="pg">
          <h2>In this issue</h2>
          <ol className="toc">{issue.pages.map((p, i) => (
            <li key={i}><button className="toc-btn" onClick={() => jump(i + 2)}>{titleOf(p)}</button></li>
          ))}</ol>
        </div>
      )
    case 'page':
      return <div className="pg"><Page p={s.p} /></div>
    case 'back':
      return (
        <div className={`cv c-${issue.color}`}>
          <h1>To be continued...</h1>
          <p>Thanks for reading issue #{pad(issue.id)}.</p>
          <div className="cv-links">
            {next && <Link className="btn red" to={`/issue/${next.id}`}>Next issue &#9654;</Link>}
            <Link className="btn" to="/">Back to the world</Link>
            <Link className="btn" to="/plain">Plain website</Link>
          </div>
        </div>
      )
    default:
      return null
  }
}

export default function Reader() {
  const { id, page } = useParams()
  const nav = useNavigate()
  const single = useSingle()
  const touchX = useRef(0)
  const issue = issues.find(i => i.id === Number(id))

  const sheets = issue ? buildSheets(issue, single) : []
  const L = single ? sheets.length : sheets.length / 2 // number of leaves
  const max = single ? L - 1 : L
  const f = Math.min(Math.max(parseInt(page ?? '0', 10) || 0, 0), max)
  const go = d => nav(`/issue/${id}/${Math.min(Math.max(f + d, 0), max)}`)
  const jump = s => nav(`/issue/${id}/${single ? s : Math.ceil(s / 2)}`)

  // Arriving from the world: the book starts closed, then opens itself
  useEffect(() => {
    if (!issue || page !== undefined) return
    const t = setTimeout(() => nav(`/issue/${id}/1`, { replace: true }), 600)
    return () => clearTimeout(t)
  }, [id, page, issue, nav])

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowRight' && f < max) go(1)
      if (e.key === 'ArrowLeft' && f > 0) go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  useEffect(() => { if (issue) document.title = `${issue.title} | Jake Stahl` }, [issue])

  if (!issue) return <main className="wrap"><h1>Issue not found</h1><Link className="btn" to="/">Back home</Link></main>

  const shown = new Set(single ? [f] : [2 * f - 1, 2 * f]) // sheets currently on screen
  const face = (idx, side) => {
    if (idx == null || idx < 0 || idx >= sheets.length) return <div className={`face ${side}`} />
    const s = sheets[idx]
    return (
      <div className={`face ${side} k-${s.kind}${shown.has(idx) ? ' shown' : ''}`}>
        <div className="fs"><Sheet s={s} issue={issue} jump={jump} /></div>
        {s.kind === 'page' && <span className="pgnum">{idx + 1}</span>}
      </div>
    )
  }

  const leaves = Array.from({ length: L }, (_, j) => (single ? [j, null] : [2 * j, 2 * j + 1]))
  const shift = single ? 'none' : f === 0 ? 'translateX(-25%)' : f === L ? 'translateX(25%)' : 'none' // keep the book centred
  const label = single ? `Page ${f + 1} of ${sheets.length}` : f === 0 ? 'Cover' : f === L ? 'The end' : `Pages ${2 * f}-${2 * f + 1} of ${sheets.length}`

  return (
    <main className="rd">
      <header className="rd-top">
        <Link className="btn" to="/">&#9664; World</Link>
        <Link className="btn" to="/plain">Plain website</Link>
      </header>

      <div className="stage"
        onTouchStart={e => { touchX.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          const dx = e.changedTouches[0].clientX - touchX.current
          if (dx < -50 && f < max) go(1)
          if (dx > 50 && f > 0) go(-1)
        }}>
        <div className={`book3d${single ? ' single' : ''}`} style={{ transform: shift }}>
          {leaves.map(([a, b], j) => {
            const flipped = j < f
            return (
              <div key={j} className={`leaf${flipped ? ' flipped' : ''}`}
                style={{ zIndex: flipped ? j : L - j, '--z': flipped ? j * 0.5 : (L - j) * 0.5 }}>
                {face(a, 'front')}
                {b != null && face(b, 'back')}
              </div>
            )
          })}
        </div>
      </div>

      <nav className="rd-nav" aria-label="Page navigation">
        <button className="btn" onClick={() => go(-1)} disabled={f === 0}>&#9664; Prev</button>
        <span className="count" aria-live="polite">{label}</span>
        <button className="btn" onClick={() => go(1)} disabled={f === max}>Next &#9654;</button>
      </nav>
    </main>
  )
}
