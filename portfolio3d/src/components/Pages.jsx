import { profile } from '../data/site.js'

// Renders one page of content. Used by the flip-book reader AND the plain website.
export const titleOf = p => p.title || p.heading

const Tags = ({ items }) => <div className="tags">{items.map(t => <span className="tag" key={t}>{t}</span>)}</div>
const Btn = ({ href, children, red }) => (
  <a className={`btn${red ? ' red' : ''}`} href={href} target="_blank" rel="noopener noreferrer">{children}</a>
)

export function Page({ p, hideHeading }) {
  const h = t => (hideHeading ? null : <h2>{t}</h2>)
  switch (p.type) {
    case 'text':
      return <>{h(p.heading)}{p.paragraphs.map((t, i) => <p key={i}>{t}</p>)}</>
    case 'tags':
      return <>{h(p.heading)}<Tags items={p.items} /></>
    case 'entries':
      return <>{h(p.heading)}{p.entries.map(e => (
        <div className="entry" key={e.title}><h3>{e.title}</h3><p className="meta">{e.meta}</p><p>{e.text}</p></div>
      ))}</>
    case 'groups':
      return <>{h(p.heading)}{Object.entries(p.groups).map(([name, items]) => (
        <div className="entry" key={name}><h3>{name}</h3><Tags items={items} /></div>
      ))}</>
    case 'stats':
      return <>{h(p.heading)}<div className="stats">{p.items.map(s => (
        <div className="stat" key={s.label}>
          <span className="big">{s.value}</span><span>{s.label}</span>
          {s.href && <a href={s.href} target="_blank" rel="noopener noreferrer">View profile</a>}
        </div>
      ))}</div></>
    case 'contact':
      return <>{h(p.heading)}
        <p>Looking for a junior developer or a collaborator? Get in touch.</p>
        <div className="links">
          {profile.email && <a className="btn red" href={`mailto:${profile.email}`}>Email</a>}
          <Btn href={profile.github} red={!profile.email}>GitHub</Btn>
          <Btn href={profile.resume}>Resume (PDF)</Btn>
          <Btn href={profile.itch}>itch.io</Btn>
        </div></>
    case 'project':
      return <>
        <div className="art">{p.image ? <img src={p.image} alt={`${p.title} screenshot`} /> : <span>{p.title}</span>}</div>
        <h2>{p.title}</h2><p className="meta">{p.kind}</p><p>{p.summary}</p>
        <h3>My role</h3><p>{p.role}</p>
        <h3>Challenges</h3><ul>{p.challenges.map(c => <li key={c}>{c}</li>)}</ul>
        <Tags items={p.tech} />
        {p.links.length > 0 && <div className="links">{p.links.map(l => <Btn key={l.href} href={l.href} red>{l.label}</Btn>)}</div>}
      </>
    default:
      return null
  }
}
