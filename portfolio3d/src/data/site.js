// All site content lives here. Components only render this data.
// Search for TODO to find the bits that still need your own words.

export const profile = {
  name: 'JAKE STAHL',
  role: 'SOFTWARE DEVELOPER',
  pitch: 'Computer science student in Melbourne building games, apps and websites.',
  github: 'https://github.com/jakestahl',
  itch: 'https://new-legacy.itch.io/',
  resume: './resume.pdf', // put resume.pdf in the /public folder
  email: '',              // TODO: add your email to show a mailto button
}

export const projects = [
  {
    title: 'Lift Up', kind: 'Android gym app',
    summary: 'Logs every workout and streams exercise demo videos from my own Cloudflare-backed API.',
    tech: ['React Native', 'Expo', 'Cloudflare'],
    role: 'TODO: what you designed and built.',
    challenges: ['TODO: a technical problem you solved.'],
    links: [],
  },
  {
    title: "Granny's Gamble", kind: 'Game',
    summary: 'TODO: one-sentence pitch.',
    tech: ['Unreal Engine', 'Blueprints'],
    role: 'TODO', challenges: ['TODO'],
    links: [{ label: 'Play on itch.io', href: 'https://new-legacy.itch.io/' }],
  },
  {
    title: 'Loop Paul', kind: 'Game',
    summary: 'TODO: one-sentence pitch.',
    tech: ['Unreal Engine', 'Blueprints'],
    role: 'TODO', challenges: ['TODO'],
    links: [{ label: 'Play on itch.io', href: 'https://new-legacy.itch.io/' }],
  },
  {
    title: 'Tether', kind: 'Game',
    summary: 'TODO: one-sentence pitch.',
    tech: ['Unreal Engine', 'Blueprints'],
    role: 'TODO', challenges: ['TODO'],
    links: [{ label: 'Play on itch.io', href: 'https://new-legacy.itch.io/' }],
  },
]

export const issues = [
  { id: 1, title: 'Origin', color: 'yellow', tagline: 'Where it started', pages: [
    { type: 'text', heading: 'Origin', paragraphs: [
      "I'm a first-year computer science student at Swinburne, majoring in software development.",
      'Last year I finished a diploma in games and interactivity, and the credits carried over into my degree.',
    ] },
    { type: 'text', heading: 'Career goals', paragraphs: [
      "I'm aiming for a software developer role. I started in games, and I'm building the skills for general software development.",
    ] },
    { type: 'tags', heading: 'Personality bits', items: ['Community', 'Comedy', 'Gamer', 'Outgoing', 'Code-obsessed'] },
  ] },
  { id: 2, title: 'Projects', color: 'red', tagline: 'Things I built', pages: projects.map(p => ({ type: 'project', ...p })) },
  { id: 3, title: 'Experience', color: 'cyan', tagline: 'Study and work', pages: [
    { type: 'entries', heading: 'Education', entries: [
      { title: 'Bachelor of Computer Science', meta: 'Swinburne, software development major, current', text: 'First year.' },
      { title: 'Diploma in Games and Interactivity', meta: 'Completed last year', text: 'Credits carried over to my bachelor degree.' },
    ] },
    { type: 'entries', heading: 'Work and achievements', entries: [
      { title: 'Three published games', meta: 'itch.io', text: 'Each has 50+ downloads.' },
      { title: 'TODO: work experience', meta: 'TODO', text: 'TODO' },
    ] },
  ] },
  { id: 4, title: 'Arsenal', color: 'purple', tagline: 'Tools of the trade', pages: [
    { type: 'groups', heading: 'Arsenal', groups: {
      Languages: ['HTML5', 'CSS3', 'C#', 'JavaScript'],
      Frameworks: ['React', 'React Native', 'Node.js', 'Expo', 'Unreal Engine (Blueprints)'],
      Tools: ['Git', 'GitHub', 'VS Code', 'Figma', 'Cloudflare'],
    } },
  ] },
  { id: 5, title: 'Stats', color: 'green', tagline: 'The numbers', pages: [
    { type: 'stats', heading: 'Stats', items: [
      { label: 'LeetCode problems solved', value: 17, href: 'https://leetcode.com/u/jake-stahl/' },
      { label: 'itch.io downloads', value: 211, href: 'https://new-legacy.itch.io/' },
      { label: 'Published games', value: 3 },
    ] },
  ] },
  { id: 6, title: 'Contact', color: 'red', tagline: 'Say hello', pages: [{ type: 'contact', heading: 'Contact' }] },
]
