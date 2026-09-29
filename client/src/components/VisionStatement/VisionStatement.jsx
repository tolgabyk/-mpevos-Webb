import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useScroll, useTransform } from 'framer-motion'
import { RevealGroup, RevealItem } from '../Reveal/Reveal'
import { EASE_SMOOTH } from '../../utils/motion'
import styles from './VisionStatement.module.css'

export default function VisionStatement() {
  const { t } = useTranslation()
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])
  const lineWidth = useTransform(scrollYProgress, [0.15, 0.5], ['0%', '100%'])

  return (
    <section id="vision" ref={sectionRef} className={styles.section}>
      {/* Background layers */}
      <div className={styles.gridBg} aria-hidden="true" />
      <div className={styles.bgGlow} />
      <div className={styles.scanLine} aria-hidden="true" />
      <motion.div className={styles.bgText} style={{ y: bgY }} aria-hidden="true">
        {t('vision.bgText')}
      </motion.div>

      <div className="container">
        <RevealGroup className={styles.inner}>
          {/* Tech frame — top corners */}
          <div className={styles.techFrame} aria-hidden="true">
            <span className={styles.cornerTL} />
            <span className={styles.cornerTR} />
            <span className={styles.cornerBL} />
            <span className={styles.cornerBR} />
          </div>

          {/* Status indicator */}
          <RevealItem>
            <div className={styles.statusRow}>
              <span className={styles.statusDot} />
              <span className={styles.statusText}>SYSTEM.VISION</span>
            </div>
          </RevealItem>

          {/* Animated line */}
          <RevealItem>
            <div className={styles.lineTrack}>
              <motion.div className={styles.lineFill} style={{ width: lineWidth }} />
            </div>
          </RevealItem>

          {/* Main quote */}
          <RevealItem>
            <h2 className={styles.quote}>
              {t('vision.quote')}
            </h2>
          </RevealItem>

          {/* Sub text */}
          <RevealItem>
            <p className={styles.sub}>{t('vision.sub')}</p>
          </RevealItem>

          {/* Bottom accent */}
          <RevealItem>
            <div className={styles.bottomAccent}>
              <span className={styles.accentDash} />
              <span className={styles.accentDot} />
              <span className={styles.accentDash} />
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  )
}
