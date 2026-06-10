import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Lightning } from '@phosphor-icons/react'
import LightBulb from '../LightBulb/LightBulb'
import styles from './VisionStatement.module.css'

export default function VisionStatement() {
  const { t } = useTranslation()

  return (
    <section className={styles.section}>
      <div className={styles.bgGlow} />
      <div className={styles.bgText} aria-hidden="true">{t('vision.bgText')}</div>

      <div className="container">
        <motion.div
          className={styles.inner}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className={styles.quote}>{t('vision.quote')}</h2>
          <p className={styles.sub}>{t('vision.sub')}</p>

          <div className={styles.bulbWrap}>
            <LightBulb active size="lg" />
            <Lightning className={styles.sparkLeft} size={28} weight="fill" />
            <Lightning className={styles.sparkRight} size={22} weight="fill" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
