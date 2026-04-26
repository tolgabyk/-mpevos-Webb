import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import styles from './Partners.module.css'

export default function Partners() {
  const { t } = useTranslation()
  const logos = t('partners.logos', { returnObjects: true }) || []

  // Split logos into two rows for more dynamic feel
  const row1 = logos.slice(0, Math.ceil(logos.length / 2))
  const row2 = logos.slice(Math.ceil(logos.length / 2))

  const marqueeRow1 = [...row1, ...row1, ...row1, ...row1]
  const marqueeRow2 = [...row2, ...row2, ...row2, ...row2]

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

      <div className={styles.marqueeContainer}>
        {/* Row 1 — Right to Left */}
        <div className={styles.slider}>
          <div className={styles.track}>
            {marqueeRow1.map((logo, i) => (
              <div key={`r1-${i}`} className={styles.partnerName}>
                {logo}
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — Left to Right */}
        <div className={`${styles.slider} ${styles.sliderReverse}`}>
          <div className={`${styles.track} ${styles.trackReverse}`}>
            {marqueeRow2.map((logo, i) => (
              <div key={`r2-${i}`} className={styles.partnerName}>
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
