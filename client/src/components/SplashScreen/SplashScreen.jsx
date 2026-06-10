import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EASE_CURTAIN, EASE_SMOOTH } from '../../utils/motion'
import styles from './SplashScreen.module.css'

const SPLASH_KEY = 'impevos-splash-seen'

export default function SplashScreen({ onComplete }) {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem(SPLASH_KEY))
  const [phase, setPhase] = useState('logo')

  useEffect(() => {
    if (!visible) {
      onComplete?.()
      return undefined
    }

    document.body.style.overflow = 'hidden'

    const t1 = setTimeout(() => setPhase('curtain'), 1800)
    const t2 = setTimeout(() => {
      sessionStorage.setItem(SPLASH_KEY, '1')
      setVisible(false)
      document.body.style.overflow = ''
      onComplete?.()
    }, 2900)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      document.body.style.overflow = ''
    }
  }, [visible, onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.overlay}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE_SMOOTH }}
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
              <motion.div
                className={styles.logoGlow}
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
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
      )}
    </AnimatePresence>
  )
}
