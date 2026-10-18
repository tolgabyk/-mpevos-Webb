import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import * as Icons from '@phosphor-icons/react'
import { NOT_ORTAGIM_SCREEN_SRCS } from '../../data/notOrtagimScreens'
import styles from './Projects.module.css'

const APP_STORE_URL =
  'https://apps.apple.com/tr/app/not-orta%C4%9F%C4%B1m-ai-not-asistan%C4%B1/id6758680814?l=tr'
const GOOGLE_PLAY_URL =
  'https://play.google.com/store/apps/details?id=com.notortagim.android'

export default function Projects() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('all')

  const tabs = t('projects.tabs', { returnObjects: true }) || {}
  const items = t('projects.items', { returnObjects: true }) || []
  const more = t('projects.more', { returnObjects: true })

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
                  className={`${styles.card} ${item.id === 'not-ortagim' ? styles.liveCard : ''}`}
                >
                  <div className={styles.image}>
                    <div className={styles.glow} />
                    {item.type === 'web' ? (
                      <div className={styles.laptop}>
                        <div className={styles.laptopLid}>
                          <div className={styles.browserBar}>
                            <span className={styles.browserDots}><i /><i /><i /></span>
                            <span className={styles.browserUrl}>{item.urlLabel || item.url?.replace(/^https?:\/\/(www\.)?/, '')}</span>
                          </div>
                          <div className={styles.laptopScreen}>
                            <PhoneCarousel screens={item.screens} alt={`${item.title} website preview`} />
                          </div>
                        </div>
                        <div className={styles.laptopBase} />
                      </div>
                    ) : item.type === 'app' && (item.screens?.length || item.id === 'not-ortagim') ? (
                      <div className={styles.phoneFrame}>
                        <div className={styles.notch} />
                        <PhoneCarousel screens={item.id === 'not-ortagim' ? NOT_ORTAGIM_SCREEN_SRCS : item.screens} />
                      </div>
                    ) : (
                      <div className={styles.phoneFrame}>
                        <div className={styles.notch} />
                        <div className={styles.placeholderScreen}>
                          {Icon && <Icon size={36} weight="duotone" />}
                          <span>{t('projects.imagePlaceholder')}</span>
                        </div>
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
                    <div className={styles.links}>
                      {item.id === 'not-ortagim' ? (
                        <>
                          <a href={APP_STORE_URL} target="_blank" rel="noreferrer" className={styles.storeLink} aria-label="App Store">
                            <Icons.AppleLogo size={18} weight="fill" />
                            <span>App Store</span>
                          </a>
                          <a href={GOOGLE_PLAY_URL} target="_blank" rel="noreferrer" className={styles.storeLink} aria-label="Google Play">
                            <Icons.GooglePlayLogo size={18} weight="fill" />
                            <span>Google Play</span>
                          </a>
                        </>
                      ) : item.url || item.href ? (
                        <a href={item.url || item.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                          <span>{item.linkLabel || item.cta || t('projects.details')}</span>
                          <Icons.ArrowUpRight size={20} weight="bold" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {more?.count && (
          <motion.div
            className={styles.more}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className={styles.moreCount}>{more.count}</div>
            <div className={styles.moreBody}>
              <h3>{more.title}</h3>
              <p>{more.desc}</p>
              {Array.isArray(more.tags) && (
                <div className={styles.moreTags}>
                  {more.tags.map(tag => <span key={tag}>{tag}</span>)}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

function PhoneCarousel({ screens = [], alt = 'App screenshot' }) {
  const [idx, setIdx] = useState(0)
  const count = screens.length

  useEffect(() => {
    if (count <= 1) return
    const interval = setInterval(() => {
      setIdx(prev => (prev + 1) % count)
    }, 2800)
    return () => clearInterval(interval)
  }, [count])

  useEffect(() => {
    screens.forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [count]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.screen}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={screens[idx % count]}
          src={screens[idx % count]}
          alt={alt}
          className={styles.screenImg}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          decoding="async"
          width={390}
          height={844}
          draggable={false}
        />
      </AnimatePresence>
      <div className={styles.glare} />
    </div>
  )
}
