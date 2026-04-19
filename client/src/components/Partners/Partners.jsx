import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import styles from './Partners.module.css'

export default function Partners() {
  const { t } = useTranslation()
  const logos = t('partners.logos', { returnObjects: true }) || []

  // Duplicate logos to create seamless infinite scroll effect
  const marqueeLogos = [...logos, ...logos]

  return (
    <section id="partners" className={styles.section}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="section-label">{t('partners.label')}</div>
          <h2 className="section-title">
            {t('partners.title')} <span className="text-accent">{t('partners.titleAccent')}</span>
          </h2>
          <p className="section-subtitle">{t('partners.subtitle')}</p>
        </motion.div>
      </div>

      <div className={styles.slider}>
        <div className={styles.track}>
          {marqueeLogos.map((logo, i) => (
            <div key={i} className={styles.logo}>
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
