import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import styles from './InternshipDetails.module.css'

export default function InternshipDetails() {
  const { t } = useTranslation()
  const intro = t('internship.details.intro', { returnObjects: true })
  const eligible = t('internship.details.eligible', { returnObjects: true })
  const areas = t('internship.details.areas', { returnObjects: true })
  const expectations = t('internship.expectations.items', { returnObjects: true })

  return (
    <section id="internship-details">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="section-label">{t('internship.details.label')}</div>
          <h2 className="section-title">
            {t('internship.details.title')}
          </h2>
        </motion.div>

        <div className={styles.grid}>
          <motion.div
            className={styles.intro}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            {intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </motion.div>

          <motion.div
            className={styles.block}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <h3>{t('internship.details.eligibleTitle')}</h3>
            <ul className={styles.list}>
              {eligible.map((item, i) => (
                <li key={i} className={styles.listItem}>
                  <span className={styles.dot} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          className={styles.block}
          style={{ marginTop: 32 }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <h3>{t('internship.expectations.title')}</h3>
          <ul className={styles.list}>
            {expectations.map((item, i) => (
              <li key={i} className={styles.listItem}>
                <span className={styles.dot} />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className={styles.block}
          style={{ marginTop: 32 }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <h3>{t('internship.details.areasTitle')}</h3>
          <div className={styles.areas}>
            {areas.map((area, i) => (
              <div key={i} className={styles.areaTag}>{area}</div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
