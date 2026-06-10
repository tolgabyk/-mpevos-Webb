import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import styles from './About.module.css'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function About() {
  const { t } = useTranslation()

  return (
    <section id="about">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-label">{t('about.label')}</div>
          <h2 className="section-title">
            {t('about.title')}<br />
            <span className="text-accent">{t('about.titleAccent')}</span>
          </h2>
          <p className="section-subtitle">{t('about.subtitle')}</p>
        </motion.div>

        <motion.div
          className={styles.text}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <h3>{t('about.h3')}</h3>
          <p>{t('about.p1')}</p>
          <p>{t('about.p2')}</p>
        </motion.div>
      </div>
    </section>
  )
}
