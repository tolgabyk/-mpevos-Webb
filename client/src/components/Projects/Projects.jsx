import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import * as Icons from '@phosphor-icons/react'
import styles from './Projects.module.css'

export default function Projects() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('all')

  const tabs = t('projects.tabs', { returnObjects: true }) || {}
  const items = t('projects.items', { returnObjects: true }) || []

  const filteredItems = items.filter(item => filter === 'all' || item.status === filter)

  return (
    <section id="projects">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="section-label">{t('projects.label')}</div>
          <h2 className="section-title">
            {t('projects.title')} <span className="text-accent">{t('projects.titleAccent')}</span>
          </h2>
          <p className="section-subtitle">{t('projects.subtitle')}</p>
        </motion.div>

        <div className={styles.tabs}>
          {Object.entries(tabs).map(([key, label]) => (
            <button
              key={key}
              className={`${styles.tab} ${filter === key ? styles.active : ''}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => {
              const Icon = Icons[item.icon]
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={styles.card}
                >
                  <div className={styles.image}>
                    <div className={styles.glow} />
                    {item.type === 'app' ? (
                      <div className={styles.phoneFrame}>
                        <div className={styles.notch} />
                        <PhoneCarousel screens={item.screens} />
                      </div>
                    ) : (
                      <div className={styles.iconPlaceholder}>
                        {Icon && <Icon size={80} weight="duotone" />}
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.body}>
                    <div className={`${styles.status} ${styles[item.status]}`}>
                      <span className={styles.statusDot} />
                      {item.statusLabel}
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                    <a href="#contact" className={styles.link}>
                      <span>{t('projects.details')}</span>
                      <Icons.ArrowRight size={20} weight="bold" />
                    </a>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function PhoneCarousel({ screens = [] }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (screens.length <= 1) return
    const interval = setInterval(() => {
      setIdx(prev => (prev + 1) % screens.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [screens])

  return (
    <div className={styles.screen}>
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={screens[idx]}
          alt="App screenshot"
          className={styles.screenImg}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>
      <div className={styles.glare} />
    </div>
  )
}
