/* ────────────────────────────────────────────────────────────
   CENTRALIZED PROFILE CONFIGURATION
   ────────────────────────────────────────────────────────────
   Every personal value used across the entire site lives here.
   Populated from AjayKumarResume.pdf (Aug 2026 version).
   ──────────────────────────────────────────────────────────── */

export const profile = {
  name: 'Ajay Kumar S',
  email: 'ajiicodes@gmail.com',
  phone: '+91 82203 30108',
  linkedin: 'https://www.linkedin.com/in/ajay-kumar-saravanakumar/',
  github: 'https://github.com/AjayKumarOnly',
  leetcode: 'https://leetcode.com/u/Ajay_Kumar_S/',
  location: 'Chennai, India',
}

export const tagline = 'Software Engineer'

/** Short intro shown in the Hero section. */
export const heroIntro =
  'Software engineer with expertise in Spring Boot, the MERN stack, and data structures & algorithms. Passionate about building secure, scalable, and high-performance software — from real-time systems to polished web applications.'

/** One-liner for the About section. */
export const aboutShort =
  'Software engineer passionate about building secure, scalable, and high-performance software. Strong problem-solving and competitive-programming foundation, with hands-on experience shipping full-stack products end to end.'

export const aboutSections = [
  {
    heading: 'Development interests',
    items: [
      'Backend engineering — Spring Boot, MERN stack, and REST API design',
      'Real-time systems — live communication, async workflows, and secure media pipelines',
      'Security & performance — authentication, cryptography, and efficient solutions',
    ],
  },
  {
    heading: 'How I work',
    items: [
      'Strong fundamentals first — DSA, OOP, DBMS, operating systems, and networks',
      'Production mindset — authentication, validation, and reliability by default',
      'Ship fast, measure honestly, and keep systems maintainable',
    ],
  },
  {
    heading: 'Career goals',
    items: [
      'Contribute to high-scale products where engineering quality directly matters',
      'Grow into a systems-focused engineering role with real ownership',
    ],
  },
]

export const facts = [
  { label: 'Focus', value: 'Spring Boot · MERN · DSA' },
  { label: 'Studying', value: 'B.E. CSE — Anna University (MIT)' },
  { label: 'Location', value: 'Chennai, India' },
  { label: 'Open to', value: 'SDE roles & internships' },
]

/** Tech showcased in the scrolling strip under the hero. */
export const heroTechStrip = [
  'Java',
  'C++',
  'Python',
  'JavaScript',
  'SQL',
  'React',
  'Spring Boot',
  'Node.js',
  'Express.js',
  'MongoDB',
  'PostgreSQL',
  'Socket.io',
]

export const skillGroups = [
  {
    title: 'Languages',
    skills: ['Java', 'C++', 'Python', 'JavaScript', 'SQL', 'HTML', 'CSS'],
  },
  {
    title: 'Frontend',
    skills: ['React.js', 'Socket.io', 'Leaflet.js', 'HTML', 'CSS'],
  },
  {
    title: 'Backend',
    skills: ['Node.js', 'Express.js', 'Spring Boot', 'REST APIs'],
  },
  {
    title: 'Databases',
    skills: ['MongoDB', 'PostgreSQL', 'MySQL', 'Oracle'],
  },
  {
    title: 'Core Competencies',
    skills: ['REST APIs', 'Authentication', 'Cryptography', 'Real-time Systems', 'DSA'],
  },
  {
    title: 'Tools & Platforms',
    skills: ['Git', 'Docker', 'Azure', 'Postman'],
  },
]

export const experience = [
  {
    period: 'Nov 2023 — Dec 2023',
    role: 'Web & Content Management Intern',
    org: 'Gexauz',
    description:
      'Developed and maintained 10+ websites and custom web modules, streamlining deployment workflows and improving content delivery efficiency by 30% while cutting publishing time by 40% across 15+ initiatives.',
  },
]

export const education = [
  {
    period: 'Aug 2025 — May 2028',
    role: 'B.E. Computer Science & Engineering',
    org: 'Anna University — MIT Campus, Chennai',
    description:
      'Current CGPA: 8.17 / 10.0. Coursework: Data Structures & Algorithms, OOP, DBMS, Operating Systems, Computer Networks, Software Engineering.',
  },
  {
    period: 'Jun 2022 — May 2025',
    role: 'Diploma in Computer Engineering',
    org: 'Nachimuthu Polytechnic College, Pollachi',
    description: 'Academic standing: 96.16%.',
  },
]

export const stats = [
  { value: '10+', label: 'Websites shipped' },
  { value: '30%', label: 'Delivery efficiency gain' },
  { value: '40%', label: 'Publishing time reduced' },
  { value: '8.17', label: 'CGPA / 10.0' },
]

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]
