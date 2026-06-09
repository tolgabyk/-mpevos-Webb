import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { UsersThree } from '@phosphor-icons/react'
import styles from '../InternshipMidBanner/InternshipMidBanner.module.css'

export default function TeamMidBanner() {
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
              <UsersThree size={24} weight="duotone" />
            </div>
            <div className={styles.text}>
              <h3>{t('joinTeam.midBanner.title')}</h3>
              <p>{t('joinTeam.midBanner.desc')}</p>
            </div>
          </div>
          <Link to="/ekibe-katil" className="btn btn-primary">
            {t('joinTeam.midBanner.cta')}
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
