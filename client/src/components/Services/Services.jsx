import { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import * as Icons from '@phosphor-icons/react'
import styles from './Services.module.css'

export default function Services() {
  const { t } = useTranslation()
  const items = t('services.items', { returnObjects: true })
  const trackRef = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    const onScroll = () => {
      const max = track.scrollWidth - track.clientWidth
      setProgress(max > 0 ? track.scrollLeft / max : 0)
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => track.removeEventListener('scroll', onScroll)
  }, [items.length])

  return (
    <section id="services" className={styles.section}>
      <div className={styles.bgGlow} />
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

        <div className={styles.carouselWrap}>
          <div ref={trackRef} className={styles.track}>
            {items.map((item, i) => {
              const Icon = Icons[item.icon]
              return (
                <motion.article
                  key={i}
                  className={styles.card}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                >
                  <div className={styles.cardBg} />
                  <div className={styles.cardShine} />
                  <div className={styles.cardBody}>
                    <div className={styles.iconCircle}>
                      {Icon && <Icon size={26} weight="duotone" />}
                    </div>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardDesc}>{item.desc}</p>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>

        <div className={styles.progressWrap}>
          <div className={styles.progressTrack}>
            <div className={styles.progressBar} style={{ transform: `scaleX(${Math.max(progress, 0.08)})` }} />
          </div>
        </div>
      </div>
    </section>
  )
}
