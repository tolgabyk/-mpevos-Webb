import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Lightning } from '@phosphor-icons/react'
import LightBulb from '../LightBulb/LightBulb'
import { RevealGroup, RevealItem } from '../Reveal/Reveal'
import { scaleIn } from '../../utils/motion'
import styles from './VisionStatement.module.css'

export default function VisionStatement() {
  const { t } = useTranslation()
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.95])

  return (
    <section id="vision" ref={sectionRef} className={styles.section}>
      <div className={styles.bgGlow} />
      <motion.div className={styles.bgText} style={{ y: bgY }} aria-hidden="true">
        {t('vision.bgText')}
      </motion.div>

      <div className="container">
        <RevealGroup className={styles.inner}>
          <RevealItem>
            <h2 className={styles.quote}>{t('vision.quote')}</h2>
          </RevealItem>
          <RevealItem>
            <p className={styles.sub}>{t('vision.sub')}</p>
          </RevealItem>
          <motion.div
            className={styles.bulbWrap}
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <motion.div style={{ scale: glowScale }}>
              <LightBulb active size="lg" />
            </motion.div>
            <Lightning className={styles.sparkLeft} size={28} weight="fill" />
            <Lightning className={styles.sparkRight} size={22} weight="fill" />
          </motion.div>
        </RevealGroup>
      </div>
    </section>
  )
}
