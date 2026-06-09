import Navbar from '../components/Navbar/Navbar'
import TeamAnnouncementBar from '../components/TeamAnnouncementBar/TeamAnnouncementBar'
import InternshipWelcomePopup from '../components/InternshipWelcomePopup/InternshipWelcomePopup'
import InternshipHero from '../components/InternshipHero/InternshipHero'
import AppShowcase from '../components/AppShowcase/AppShowcase'
import About from '../components/About/About'
import Services from '../components/Services/Services'
import Projects from '../components/Projects/Projects'
import InternshipMidBanner from '../components/InternshipMidBanner/InternshipMidBanner'
import TeamMidBanner from '../components/TeamMidBanner/TeamMidBanner'
import Team from '../components/Team/Team'
import InternshipDetails from '../components/InternshipDetails/InternshipDetails'
import InternshipForm from '../components/InternshipForm/InternshipForm'
import Contact from '../components/Contact/Contact'
import Footer from '../components/Footer/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <TeamAnnouncementBar />
      <InternshipWelcomePopup />
      <main>
        <InternshipHero />
        <AppShowcase />
        <About />
        <Services />
        <Projects />
        <InternshipMidBanner />
        <Team />
        <TeamMidBanner />
        <InternshipDetails />
        <InternshipForm />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
