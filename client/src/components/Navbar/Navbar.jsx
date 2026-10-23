import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { List, X, ArrowUpRight } from '@phosphor-icons/react'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import styles from './Navbar.module.css'

const NAV_IDS = ['hero', 'projects', 'about', 'process', 'why', 'team', 'faq', 'contact']

export default function Navbar() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > 30)
  const [menuOpen, setMenuOpen] = useState(false)
  const activeId = useScrollSpy(isHome ? NAV_IDS : [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (id) => {
    setMenuOpen(false)
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/#${id}`)
    }
  }

  const handleLogoClick = () => {
    setMenuOpen(false)
    if (isHome) {
      document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  const navItems = [
    { id: 'projects', label: t('nav.projects', 'Products') },
    { id: 'about', label: t('nav.studio', 'Studio') },
    { id: 'process', label: t('nav.process', 'How We Work') },
    { id: 'why', label: t('nav.dna', 'Our DNA') },
    { id: 'team', label: t('nav.team', 'Team') },
    { id: 'faq', label: t('nav.faq', 'FAQ') },
    { id: 'contact', label: t('nav.contact', 'Contact') },
  ]

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          {/* Logo */}
          <button className={styles.logo} onClick={handleLogoClick} aria-label="Impevos Home">
            <img src="/logo.png" alt="IMPEVOS Logo" />
          </button>

          {/* Desktop Nav */}
          <ul className={styles.navLinks}>
            {navItems.map(({ id, label }) => (
              <li key={id}>
                <button
                  className={`${styles.navLink} ${activeId === id ? styles.active : ''}`}
                  onClick={() => handleNavClick(id)}
                >
                  {label}
                  {activeId === id && (
                    <motion.span
                      className={styles.activeDot}
                      layoutId="activeDot"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className={styles.navRight}>
            <button
              type="button"
              className={styles.applyBtn}
              onClick={() => handleNavClick('contact')}
            >
              <span>{t('nav.partnerWithUs', 'Partner With Us')}</span>
              <ArrowUpRight size={14} weight="bold" />
            </button>

            {/* Hamburger */}
            <button
              className={styles.hamburger}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            <ul className={styles.mobileNavLinks}>
              {navItems.map(({ id, label }, i) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <button
                    className={`${styles.mobileNavLink} ${activeId === id ? styles.active : ''}`}
                    onClick={() => handleNavClick(id)}
                  >
                    {label}
                  </button>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.04 }}
              >
                <button
                  type="button"
                  className={styles.mobileApplyBtn}
                  onClick={() => handleNavClick('contact')}
                >
                  {t('nav.partnerWithUs', 'Partner With Us')}
                </button>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
