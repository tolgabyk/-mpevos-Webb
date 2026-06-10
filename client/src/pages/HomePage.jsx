import Navbar from '../components/Navbar/Navbar'
import Hero from '../components/Hero/Hero'
import AppShowcase from '../components/AppShowcase/AppShowcase'
import About from '../components/About/About'
import Services from '../components/Services/Services'
import Projects from '../components/Projects/Projects'
import Team from '../components/Team/Team'
import InternshipDetails from '../components/InternshipDetails/InternshipDetails'
import InternshipForm from '../components/InternshipForm/InternshipForm'
import Contact from '../components/Contact/Contact'
import Footer from '../components/Footer/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AppShowcase />
        <About />
        <Services />
        <Projects />
        <Team />
        <InternshipDetails />
        <InternshipForm />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
