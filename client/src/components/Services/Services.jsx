import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import * as Icons from '@phosphor-icons/react'
import { ArrowUpRight } from '@phosphor-icons/react'
import styles from './Services.module.css'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
  }
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
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      card.style.setProperty('--mouse-x', `${x}px`)
      card.style.setProperty('--mouse-y', `${y}px`)
    }
  }

  return (
    <section id="services" className={styles.section}>
      <div className={styles.bgDecoration} />
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
          ref={containerRef}
          className={styles.grid}
          onMouseMove={handleMouseMove}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {items.map((item, i) => {
            const Icon = Icons[item.icon]
            return (
              <motion.div key={i} className={styles.card} variants={cardVariants}>
                <div className={styles.cardGlow} />
                
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrap}>
                    {Icon && <Icon size={28} weight="duotone" />}
                  </div>
                  <div className={styles.arrowIcon}>
                    <ArrowUpRight size={24} weight="regular" />
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDesc}>{item.desc}</p>
                </div>
                
                <div className={styles.cardBorder} />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
