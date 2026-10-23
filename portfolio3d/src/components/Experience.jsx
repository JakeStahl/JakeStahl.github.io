import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { issues, profile } from '../data/site.js'

/* ---------- Config ---------- */
const N = issues.length
const GAP = 16 // distance between chapter stops along the road
const HEX = { yellow: '#FFD60A', red: '#E8123C', cyan: '#00B8F0', purple: '#A66BFF', green: '#19C37D' }
const stopX = i => (i % 2 ? 3 : -3)
const BLURBS = [
  "First-year computer science student in Melbourne. I started in games and I'm building toward software development.",
  'An Android gym app and three Unreal Engine games on itch.io.',
  'Where I study and what I have shipped so far.',
  'The languages, frameworks and tools I work with.',
  'LeetCode, itch.io and more, by the numbers.',
  "Looking for a junior developer or a collaborator? Let's talk.",
]
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ---------- 3D pieces ---------- */
// Toon-shaded mesh with a black "inverted hull" outline: the cheap way to get a comic look
function Solid({ color, children, ...p }) {
  return (
    <group {...p}>
      <mesh>{children}<meshToonMaterial color={color} /></mesh>
      <mesh scale={1.06}>{children}<meshBasicMaterial color="#000" side={THREE.BackSide} /></mesh>
    </group>
  )
}

const PROPS = [
  <icosahedronGeometry args={[0.8, 0]} />, <octahedronGeometry args={[0.9]} />, <torusGeometry args={[0.7, 0.28, 8, 16]} />,
  <dodecahedronGeometry args={[0.8]} />, <coneGeometry args={[0.8, 1.5, 5]} />, <tetrahedronGeometry args={[0.95]} />,
]

function Station({ issue, i }) {
  const spin = useRef()
  const hex = HEX[issue.color]
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    spin.current.rotation.y = t * 0.7
    spin.current.position.y = 4.9 + Math.sin(t * 1.6 + i) * 0.25
  })
  return (
    <group position={[stopX(i), 0, -i * GAP]}>
      {/* comic panel backdrop */}
      <mesh position={[0, 5, -4]}><planeGeometry args={[11, 11]} /><meshBasicMaterial color="#000" /></mesh>
      <mesh position={[0, 5, -3.9]}><planeGeometry args={[10.2, 10.2]} /><meshBasicMaterial color={hex} /></mesh>
      <Solid color="#fff" position={[0, 0.35, 0]}><cylinderGeometry args={[2.4, 2.6, 0.7, 24]} /></Solid>
      <group position={[0, 2.4, 0]} rotation={[0, -0.3, 0]}>
        <Solid color={hex}><boxGeometry args={[2.6, 3.4, 0.5]} /></Solid>
        <Solid color="#fff" position={[0, 0.9, 0.3]}><boxGeometry args={[1.8, 0.8, 0.1]} /></Solid>
      </group>
      <group ref={spin} position={[0, 4.9, 0]}><Solid color="#fff">{PROPS[i % PROPS.length]}</Solid></group>
    </group>
  )
}

function Decor() {
  const items = useMemo(() => Array.from({ length: 28 }, (_, k) => {
    let x = ((k * 37) % 17 - 8) * 1.7
    if (Math.abs(x) < 6) x += x < 0 ? -7 : 7 // keep the road and stations clear
    return { k, x, y: 0.8 + (k % 5) * 0.7, z: -k * 3.6 - 2, c: Object.values(HEX)[k % 5], g: k % 3 }
  }), [])
  return items.map(d => (
    <Solid key={d.k} color={d.c} position={[d.x, d.y, d.z]} rotation={[d.k, d.k * 2, 0]}>
      {d.g === 0 ? <boxGeometry args={[1, 1, 1]} /> : d.g === 1 ? <octahedronGeometry args={[0.8]} /> : <tetrahedronGeometry args={[0.9]} />}
    </Solid>
  ))
}

function World() {
  return (
    <>
      <color attach="background" args={['#1E6BFF']} />
      <fog attach="fog" args={['#1E6BFF', 18, 70]} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[6, 12, 8]} intensity={1.4} />
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, -40]}><planeGeometry args={[160, 200]} /><meshBasicMaterial color="#FFD60A" /></mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, -40]}><planeGeometry args={[7, 200]} /><meshBasicMaterial color="#000" /></mesh>
      {issues.map((s, i) => <Station key={s.id} issue={s} i={i} />)}
      <Decor />
    </>
  )
}

/* ---------- Camera: scroll progress (0..1) glides the camera between chapter stops ---------- */
const A = new THREE.Vector3(), B = new THREE.Vector3(), POS = new THREE.Vector3(), LOOK = new THREE.Vector3()
const camFor = (i, out) => out.set(stopX(i) - 2, 2.6, -i * GAP + 9)
const lookFor = (i, out) => out.set(stopX(i), 2.2, -i * GAP)
const ease = f => f * f * (3 - 2 * f) // smoothstep: the camera lingers at each stop

function Rig({ progress }) {
  const { camera, size } = useThree()
  const look = useRef(new THREE.Vector3(-3, 2.2, 0))
  useEffect(() => { camera.fov = size.width < size.height ? 70 : 50; camera.updateProjectionMatrix() }, [camera, size])
  useFrame(({ clock }, dt) => {
    const t = progress.current * (N - 1)
    const i = Math.min(Math.floor(t), N - 2)
    const f = ease(t - i)
    POS.lerpVectors(camFor(i, A), camFor(i + 1, B), f)
    POS.y += Math.sin(clock.elapsedTime * 0.6) * 0.12
    LOOK.lerpVectors(lookFor(i, A), lookFor(i + 1, B), f)
    const k = 1 - Math.pow(0.0005, dt) // frame-rate independent damping
    camera.position.lerp(POS, k)
    look.current.lerp(LOOK, k)
    camera.lookAt(look.current)
  })
  return null
}

/* ---------- Page ---------- */
export default function Experience() {
  const progress = useRef(0)
  const bar = useRef(null)
  const [active, setActive] = useState(0)

  const jump = i => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: (Math.max(0, Math.min(N - 1, i)) / (N - 1)) * max, behavior: reduced() ? 'auto' : 'smooth' })
  }

  useEffect(() => {
    document.title = 'Jake Stahl | Software Developer'
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0
      progress.current = p
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
      const idx = Math.round(p * (N - 1))
      setActive(a => (a === idx ? a : idx))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [])

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); jump(active + 1) }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); jump(active - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  const issue = issues[active]
  return (
    <>
      <div className="xp-bar" ref={bar} />
      <header className="xp-top">
        <span className="xp-brand" style={{ visibility: active ? 'visible' : 'hidden' }}>{profile.name}</span>
        <span className="xp-actions">
          <Link className="btn" to="/plain">Plain version</Link>
          <a className="btn red" href={profile.resume} target="_blank" rel="noopener noreferrer">Resume</a>
        </span>
      </header>

      <div className="xp-canvas" aria-hidden="true">
        <Canvas dpr={[1, 1.5]} camera={{ position: [-5, 2.6, 9], fov: 50 }} gl={{ powerPreference: 'high-performance' }}>
          <Rig progress={progress} />
          <World />
        </Canvas>
      </div>
      <div className="halftone" />

      {active === 0 && (
        <div className="xp-hero">
          <h1>{profile.name}</h1>
          <p className="role">{profile.role}</p>
          <p className="scrollhint">Scroll &#9660;</p>
        </div>
      )}

      <section className="xp-card" key={active} aria-live="polite">
        <h2>#{String(issue.id).padStart(2, '0')} {issue.title}</h2>
        <p>{BLURBS[active]}</p>
        <Link className="btn red" to={`/issue/${issue.id}`}>Read issue &#9654;</Link>
      </section>

      <nav className="xp-nav" aria-label="Chapters">
        {issues.map((s, i) => (
          <button key={s.id} className={i === active ? 'on' : ''} onClick={() => jump(i)}
            aria-label={`Go to issue ${s.id}: ${s.title}`} aria-current={i === active}>
            <b>{i + 1}</b><span className="lbl">{s.title}</span>
          </button>
        ))}
      </nav>

      {/* Invisible spacer: the page scroll drives the camera */}
      <div style={{ height: `${N * 90}vh` }} />
    </>
  )
}
