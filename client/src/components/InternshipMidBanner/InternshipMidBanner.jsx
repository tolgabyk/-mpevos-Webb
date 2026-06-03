import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { GraduationCap } from '@phosphor-icons/react'
import styles from './InternshipMidBanner.module.css'

export default function InternshipMidBanner() {
  const { t } = useTranslation()

  return (
    <section className={styles.section}>
      <motion.div
        className={styles.banner}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
      >
        <div className={`container ${styles.inner}`}>
          <div className={styles.content}>
            <div className={styles.icon}>
              <GraduationCap size={24} weight="duotone" />
            </div>
            <div className={styles.text}>
              <h3>{t('internship.midBanner.title')}</h3>
              <p>{t('internship.midBanner.desc')}</p>
            </div>
          </div>
          <a href="#internship-apply" className="btn btn-primary">
            {t('internship.midBanner.cta')}
          </a>
        </div>
      </motion.div>
    </section>
  )
}
