import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ShieldCheck, Sparkle } from '@phosphor-icons/react'
import styles from './About.module.css'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
}

export default function About() {
  const { t } = useTranslation()

  return (
    <section id="about" className={styles.section}>
      <div className={styles.bgGlow} />

      <div className="container">
        <motion.article
          className={styles.featuredCard}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className={styles.featuredBg} />
          <div className={styles.featuredContent}>
            <span className={styles.featuredTag}>{t('about.featured.tag')}</span>
            <h2 className={styles.featuredTitle}>{t('about.featured.title')}</h2>
            <p className={styles.featuredLead}>{t('about.featured.lead')}</p>
            <div className={styles.featuredCols}>
              <p className={styles.featuredBody}>{t('about.featured.body1')}</p>
              <p className={styles.featuredBodyMuted}>{t('about.featured.body2')}</p>
            </div>
          </div>
          <div className={styles.featuredVisual} aria-hidden="true">
            <div className={styles.orbitRing} />
            <div className={styles.visualOrb}>
              <Sparkle size={48} weight="fill" />
            </div>
          </div>
        </motion.article>

        <motion.article
          className={styles.trustCard}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <div className={styles.trustLeft}>
            <ShieldCheck size={32} weight="duotone" className={styles.trustIcon} />
            <h3>{t('about.trust.title')}</h3>
            <p>{t('about.trust.lead')}</p>
          </div>
          <div className={styles.trustRight}>
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
          </div>
        </motion.article>
      </div>
    </section>
  )
}
