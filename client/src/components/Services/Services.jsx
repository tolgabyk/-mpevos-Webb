import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import * as Icons from '@phosphor-icons/react'
import { ArrowUpRight } from '@phosphor-icons/react'
import styles from './Services.module.css'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 48, rotateX: 8 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Services() {
  const { t } = useTranslation()
  const items = t('services.items', { returnObjects: true })
  const containerRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const cards = containerRef.current.getElementsByClassName(styles.card)
    for (const card of cards) {
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
    }
  }

  return (
    <section id="services" className={styles.section}>
      <div className={styles.bgText} aria-hidden="true">{t('services.bgText')}</div>
      <div className={styles.bgDecoration} />
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="section-label">{t('services.label')}</div>
          <h2 className="section-title">
            {t('services.title')}{' '}
            <span className="text-accent">{t('services.titleAccent')}</span>{' '}
            {t('services.titleEnd')}
          </h2>
          <p className={styles.lead}>{t('services.lead')}</p>
          <p className="section-subtitle">{t('services.subtitle')}</p>
        </motion.div>

        <motion.div
          ref={containerRef}
          className={styles.grid}
          onMouseMove={handleMouseMove}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {items.map((item, i) => {
            const Icon = Icons[item.icon]
            const num = String(i + 1).padStart(2, '0')
            return (
              <motion.article key={i} className={styles.card} variants={cardVariants}>
                <div className={styles.cardGlow} />
                <div className={styles.cardShine} />

                <div className={styles.cardTop}>
                  <span className={styles.cardNum}>{num}</span>
                  <div className={styles.arrowIcon}>
                    <ArrowUpRight size={22} weight="bold" />
                  </div>
                </div>

                <div className={styles.iconWrap}>
                  {Icon && <Icon size={32} weight="duotone" />}
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDesc}>{item.desc}</p>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.cardTag}>{t('services.cardTag')}</span>
                  <span className={styles.cardLine} />
                </div>

                <div className={styles.cardBorder} />
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
