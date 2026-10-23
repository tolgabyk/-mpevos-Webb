import { useState, useCallback } from 'react'
import Navbar from '../components/Navbar/Navbar'
import SplashScreen from '../components/SplashScreen/SplashScreen'
import Hero from '../components/Hero/Hero'
import WhoWeAre from '../components/WhoWeAre/WhoWeAre'
import Process from '../components/Process/Process'
import Projects from '../components/Projects/Projects'
import AppShowcase from '../components/AppShowcase/AppShowcase'
import WhyUs from '../components/WhyUs/WhyUs'
import Stats from '../components/Stats/Stats'
import Team from '../components/Team/Team'
import Faq from '../components/Faq/Faq'
import Contact from '../components/Contact/Contact'
import Footer from '../components/Footer/Footer'

export default function HomePage() {
  const [splashDone, setSplashDone] = useState(() => !!sessionStorage.getItem('impevos-splash-seen'))
  const handleStartReveal = useCallback(() => setSplashDone(true), [])
  const handleSplashComplete = useCallback(() => setSplashDone(true), [])

  return (
    <>
      <SplashScreen onStartReveal={handleStartReveal} onComplete={handleSplashComplete} />
      <Navbar />
      <main>
        <Hero ready={splashDone} />
        <WhoWeAre />
        <Process />
        <Projects />
        <AppShowcase />
        <WhyUs />
        <Stats />
        <Team />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
