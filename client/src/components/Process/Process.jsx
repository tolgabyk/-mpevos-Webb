import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { EASE_SMOOTH } from '../../utils/motion'
import styles from './Process.module.css'

export default function Process() {
  const { t } = useTranslation()
  const steps = t('process.steps', { returnObjects: true }) || []

  return (
    <section id="process" className={styles.section} aria-labelledby="process-title">
      <div className="container">
        <div className="section-header">
          <div className="section-label">{t('process.label')}</div>
          <h2 id="process-title" className="section-title">{t('process.title')}</h2>
          <p className="section-subtitle">{t('process.subtitle')}</p>
        </div>

        <ol className={styles.steps}>
          {Array.isArray(steps) && steps.map((step, i) => (
            <motion.li
              key={step.title}
              className={styles.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: 0.06 * i, duration: 0.5, ease: EASE_SMOOTH }}
            >
              <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
