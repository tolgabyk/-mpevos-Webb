import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Code, Users, GraduationCap, Globe } from '@phosphor-icons/react'
import styles from './InternshipHighlight.module.css'

const ICONS = [Code, Users, GraduationCap, Globe]

export default function InternshipHighlight() {
  const { t } = useTranslation()
  const cards = t('internship.highlight.cards', { returnObjects: true })

  return (
    <section className={styles.section}>
      <div className="container">
        <motion.div
          className={styles.announcement}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
        >
          <div className={styles.announcementContent}>
            <h3>{t('internship.highlight.title')}</h3>
            <p>{t('internship.highlight.desc')}</p>
          </div>
          <a href="#internship-apply" className="btn btn-primary">
            {t('internship.highlight.cta')}
          </a>
        </motion.div>

        <div className={styles.cards}>
          {cards.map((card, i) => {
            const Icon = ICONS[i]
            return (
              <motion.div
                key={i}
                className={styles.card}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08 }}
              >
                <div className={styles.iconWrap}>
                  <Icon size={24} weight="duotone" />
                </div>
                <h4>{card}</h4>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
