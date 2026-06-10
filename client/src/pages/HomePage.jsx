import { useState, useCallback } from 'react'
import Navbar from '../components/Navbar/Navbar'
import SplashScreen from '../components/SplashScreen/SplashScreen'
import Hero from '../components/Hero/Hero'
import VisionStatement from '../components/VisionStatement/VisionStatement'
import AppShowcase from '../components/AppShowcase/AppShowcase'
import About from '../components/About/About'
import Services from '../components/Services/Services'
import Projects from '../components/Projects/Projects'
import InternshipDetails from '../components/InternshipDetails/InternshipDetails'
import InternshipForm from '../components/InternshipForm/InternshipForm'
import Contact from '../components/Contact/Contact'
import ContactFab from '../components/ContactFab/ContactFab'
import Footer from '../components/Footer/Footer'

export default function HomePage() {
  const [splashDone, setSplashDone] = useState(() => !!sessionStorage.getItem('impevos-splash-seen'))
  const handleSplashComplete = useCallback(() => setSplashDone(true), [])

  return (
    <>
      <SplashScreen onComplete={handleSplashComplete} />
      <Navbar />
      <main>
        <Hero ready={splashDone} />
        <VisionStatement />
        <AppShowcase />
        <About />
        <Services />
        <Projects />
        <InternshipDetails />
        <InternshipForm />
        <Contact />
      </main>
      <Footer />
      <ContactFab />
    </>
  )
}
