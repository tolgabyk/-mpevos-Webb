import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import * as Icons from '@phosphor-icons/react'
import styles from './Services.module.css'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

export default function Services() {
  const { t } = useTranslation()
  const items = t('services.items', { returnObjects: true })

  return (
    <section id="services">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-label">{t('services.label')}</div>
          <h2 className="section-title">
            {t('services.title')} <span className="text-accent">{t('services.titleAccent')}</span> {t('services.titleEnd')}
          </h2>
          <p className="section-subtitle">{t('services.subtitle')}</p>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {items.map((item, i) => {
            const Icon = Icons[item.icon]
            return (
              <motion.div key={i} className={styles.card} variants={cardVariants}>
                <div className={styles.iconWrap}>
                  {Icon && <Icon size={26} weight="duotone" />}
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
