import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { List, X } from '@phosphor-icons/react'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import styles from './Navbar.module.css'

const NAV_IDS = ['hero', 'about', 'services', 'projects', 'team', 'internship-details', 'internship-apply', 'contact']

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const activeId = useScrollSpy(NAV_IDS)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const switchLang = (lang) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('impevos-lang', lang)
  }

  const handleNavClick = (id) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const navItems = [
    { id: 'hero', label: t('nav.home') },
    { id: 'about', label: t('nav.about') },
    { id: 'services', label: t('nav.services') },
    { id: 'projects', label: t('nav.projects') },
    { id: 'team', label: t('nav.team') },
    { id: 'internship-details', label: t('nav.internship') },
    { id: 'contact', label: t('nav.contact') },
  ]

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          {/* Logo */}
          <button className={styles.logo} onClick={() => handleNavClick('hero')}>
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
            {/* Lang Toggle */}
            <div className={styles.langToggle}>
              <button
                className={`${styles.langBtn} ${i18n.language === 'tr' ? styles.langActive : ''}`}
                onClick={() => switchLang('tr')}
              >TR</button>
              <button
                className={`${styles.langBtn} ${i18n.language === 'en' ? styles.langActive : ''}`}
                onClick={() => switchLang('en')}
              >EN</button>
            </div>

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
                  transition={{ delay: i * 0.06 }}
                >
                  <button
                    className={`${styles.mobileNavLink} ${activeId === id ? styles.active : ''}`}
                    onClick={() => handleNavClick(id)}
                  >
                    {label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <div className={styles.mobileLangToggle}>
              <button className={`${styles.langBtn} ${i18n.language === 'tr' ? styles.langActive : ''}`} onClick={() => switchLang('tr')}>TR</button>
              <button className={`${styles.langBtn} ${i18n.language === 'en' ? styles.langActive : ''}`} onClick={() => switchLang('en')}>EN</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
