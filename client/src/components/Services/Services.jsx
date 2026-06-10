import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import * as Icons from '@phosphor-icons/react'
import CardStack from '../CardStack/CardStack'
import styles from './Services.module.css'

export default function Services() {
  const { t } = useTranslation()
  const rawItems = t('services.items', { returnObjects: true })
  const items = rawItems.map((item, i) => ({ ...item, id: `service-${i}` }))

  return (
    <section id="services" className={styles.section}>
      <div className={styles.bgGlow} />
      <div className={styles.bgText} aria-hidden="true">{t('services.bgText')}</div>

      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className={styles.title}>
            {t('services.title')}{' '}
            <span className="text-accent">{t('services.titleAccent')}</span>
          </h2>
          <p className={styles.lead}>{t('services.lead')}</p>
        </motion.div>

        <CardStack
          items={items}
          variant="glass"
          showManualProgress
          className={styles.stack}
          deckClassName={styles.deck}
          renderCard={(item, isFront) => {
            const Icon = Icons[item.icon]
            return (
              <div className={styles.cardContent}>
                <div className={styles.cardBg} />
                <div className={styles.cardShine} />
                <div className={styles.cardAmbient} />
                <div className={styles.cardBody}>
                  <div className={styles.iconCircle}>
                    {Icon && <Icon size={26} weight="duotone" />}
                  </div>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  {isFront && <p className={styles.cardDesc}>{item.desc}</p>}
                </div>
              </div>
            )
          }}
        />
      </div>
    </section>
  )
}
