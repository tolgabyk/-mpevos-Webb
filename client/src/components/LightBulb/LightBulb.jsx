import { motion } from 'framer-motion'
import styles from './LightBulb.module.css'

export default function LightBulb({ active = true, size = 'md' }) {
  return (
    <div className={`${styles.wrap} ${styles[size]} ${active ? styles.active : ''}`} aria-hidden="true">
      <motion.div
        className={styles.orbit}
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      >
        <span className={styles.orbitDot} />
      </motion.div>

      <motion.div
        className={styles.bulb}
        animate={active ? { scale: [1, 1.04, 1] } : { scale: 1 }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className={styles.glass}>
          <div className={styles.filament}>
            <span />
            <span />
          </div>
          <div className={styles.glowCore} />
          <div className={styles.glassShine} />
        </div>
        <div className={styles.base}>
          <span /><span /><span />
        </div>
      </motion.div>

      <div className={styles.ambientGlow} />
    </div>
  )
}
