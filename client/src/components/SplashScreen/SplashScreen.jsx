import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { EASE_CURTAIN, EASE_SMOOTH } from '../../utils/motion'
import styles from './SplashScreen.module.css'

const SPLASH_KEY = 'impevos-splash-seen'

function splashAlreadySeen() {
  try {
    return sessionStorage.getItem(SPLASH_KEY) === '1'
  } catch {
    return false
  }
}

export default function SplashScreen({ onStartReveal, onComplete }) {
  const [visible, setVisible] = useState(() => !splashAlreadySeen())
  const [phase, setPhase] = useState('logo')

  useEffect(() => {
    if (!visible) {
      onComplete?.()
      return undefined
    }

    document.body.style.overflow = 'hidden'

    // At 850ms, start opening curtains and notify Hero/Navbar to reveal
    const t1 = setTimeout(() => {
      setPhase('curtain')
      onStartReveal?.()
    }, 850)

    // At 1650ms, curtains have fully cleared the viewport; unmount cleanly
    const t2 = setTimeout(() => {
      try {
        sessionStorage.setItem(SPLASH_KEY, '1')
      } catch {
        // Storage disabled fallback
      }
      document.body.style.overflow = ''
      setVisible(false)
      onComplete?.()
    }, 1650)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      document.body.style.overflow = ''
    }
  }, [visible, onStartReveal, onComplete])

  if (!visible) return null

  const isCurtain = phase === 'curtain'

  return (
    <div className={`${styles.overlay} ${isCurtain ? styles.overlayCurtain : ''}`}>
      {/* Top Curtain Panel */}
      <motion.div
        className={styles.curtainTop}
        initial={{ y: '0%' }}
        animate={{ y: isCurtain ? '-100%' : '0%' }}
        transition={{ duration: 0.8, ease: EASE_CURTAIN }}
      />

      {/* Bottom Curtain Panel */}
      <motion.div
        className={styles.curtainBottom}
        initial={{ y: '0%' }}
        animate={{ y: isCurtain ? '100%' : '0%' }}
        transition={{ duration: 0.8, ease: EASE_CURTAIN }}
      />

      {/* Logo & Progress Bar */}
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, scale: 0.88 }}
        animate={
          isCurtain
            ? { opacity: 0, scale: 1.05 }
            : { opacity: 1, scale: 1 }
        }
        transition={{
          duration: isCurtain ? 0.35 : 0.65,
          ease: EASE_SMOOTH,
        }}
      >
        <div className={styles.logoWrap}>
          <div className={styles.logoGlow} />
          <motion.img
            src="/logo.png"
            alt="IMPEVOS"
            className={styles.logo}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.6, ease: EASE_SMOOTH }}
          />
        </div>

        <div className={styles.progressTrack}>
          <motion.div
            className={styles.progressBar}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: EASE_SMOOTH }}
          />
        </div>

        <span className={styles.tagline}>IMPEVOS TEKNOLOJİ</span>
      </motion.div>
    </div>
  )
}
