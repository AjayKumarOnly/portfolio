import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import Experience from '../components/Experience'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import { useProjects } from '../hooks/useProjects'
import { useScrollReveal } from '../hooks/useScrollReveal'

/**
 * Public portfolio page.
 * Projects read from Firestore in real-time — the same data the
 * admin panel writes. No hardcoded project arrays.
 */
export default function Home() {
  const { projects, isLoading, isError, error, retry } = useProjects()
  useScrollReveal()

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects
          projects={projects}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={retry}
        />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
