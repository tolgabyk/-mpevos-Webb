import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { RocketLaunch, Stack, Brain, Handshake } from '@phosphor-icons/react'
import { EASE_SMOOTH } from '../../utils/motion'
import styles from './WhyUs.module.css'

const ICONS = { RocketLaunch, Stack, Brain, Handshake }

export default function WhyUs() {
  const { t } = useTranslation()
  const items = t('whyUs.items', { returnObjects: true }) || []

  return (
    <section id="why" className={styles.section} aria-labelledby="why-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.intro}>
          <div className="section-label">{t('whyUs.label')}</div>
          <h2 id="why-title" className={styles.title}>{t('whyUs.title')}</h2>
          <p className={styles.lead}>{t('whyUs.subtitle')}</p>
        </div>
        <div className={styles.grid}>
          {Array.isArray(items) && items.map((item, i) => {
            const Icon = ICONS[item.icon] || Stack
            return (
              <motion.div
                key={item.title}
                className={styles.item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: 0.06 * i, duration: 0.5, ease: EASE_SMOOTH }}
              >
                <Icon size={24} weight="duotone" className={styles.icon} />
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
