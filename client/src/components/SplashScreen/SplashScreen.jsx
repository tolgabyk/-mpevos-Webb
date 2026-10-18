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

export default function SplashScreen({ onComplete }) {
  const [visible, setVisible] = useState(() => !splashAlreadySeen())
  const [phase, setPhase] = useState('logo')

  useEffect(() => {
    if (!visible) {
      onComplete?.()
      return undefined
    }

    document.body.style.overflow = 'hidden'

    const finish = () => {
      try {
        sessionStorage.setItem(SPLASH_KEY, '1')
      } catch {
        // Depolama kapalıysa site yine de açılsın.
      }
      document.body.style.overflow = ''
      setVisible(false)
      onComplete?.()
    }

    const t1 = setTimeout(() => setPhase('curtain'), 900)
    const t2 = setTimeout(finish, 1600)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      document.body.style.overflow = ''
    }
  }, [visible, onComplete])

  if (!visible) return null

  return (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'curtain' ? 0 : 1 }}
          transition={{ duration: 0.45, ease: EASE_SMOOTH }}
        >
          {phase === 'curtain' && (
            <>
              <motion.div
                className={styles.curtainTop}
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                transition={{ duration: 1, ease: EASE_CURTAIN }}
              />
              <motion.div
                className={styles.curtainBottom}
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                transition={{ duration: 1, ease: EASE_CURTAIN }}
              />
            </>
          )}

          <motion.div
            className={styles.inner}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={
              phase === 'curtain'
                ? { opacity: 0, scale: 1.08 }
                : { opacity: 1, scale: 1 }
            }
            transition={{ duration: 0.9, ease: EASE_SMOOTH }}
          >
            <div className={styles.logoWrap}>
              <div className={styles.logoGlow} />
              <motion.img
                src="/logo.png"
                alt="IMPEVOS"
                className={styles.logo}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7 }}
              />
            </div>

            <div className={styles.progressTrack}>
              <motion.div
                className={styles.progressBar}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, ease: EASE_SMOOTH }}
              />
            </div>

            <span className={styles.tagline}>IMPEVOS TEKNOLOJİ</span>
          </motion.div>
        </motion.div>
  )
}
