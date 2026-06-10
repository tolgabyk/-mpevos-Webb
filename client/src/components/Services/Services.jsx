import { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import * as Icons from '@phosphor-icons/react'
import { RevealGroup, RevealItem } from '../Reveal/Reveal'
import { EASE_SMOOTH, fadeUp, VIEWPORT_TIGHT } from '../../utils/motion'
import styles from './Services.module.css'

export default function Services() {
  const { t } = useTranslation()
  const items = t('services.items', { returnObjects: true })
  const trackRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    const onScroll = () => {
      const max = track.scrollWidth - track.clientWidth
      const ratio = max > 0 ? track.scrollLeft / max : 0
      setProgress(ratio)

      const cards = track.querySelectorAll('[data-service-card]')
      let closest = 0
      let minDist = Infinity
      cards.forEach((el, i) => {
        const dist = Math.abs(el.offsetLeft - track.scrollLeft - 8)
        if (dist < minDist) {
          minDist = dist
          closest = i
        }
      })
      setActiveIdx(closest)
    }

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      e.preventDefault()
      track.scrollLeft += e.deltaY * 0.9
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    track.addEventListener('wheel', onWheel, { passive: false })
    onScroll()
    return () => {
      track.removeEventListener('scroll', onScroll)
      track.removeEventListener('wheel', onWheel)
    }
  }, [items.length])

  const scrollToCard = (index) => {
    const track = trackRef.current
    const card = track?.querySelector(`[data-service-card="${index}"]`)
    card?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }

  return (
    <section id="services" className={styles.section}>
      <div className={styles.bgGlow} />
      <div className={styles.bgText} aria-hidden="true">{t('services.bgText')}</div>

      <div className="container">
        <RevealGroup className={styles.header}>
          <RevealItem>
            <h2 className={styles.title}>
              {t('services.title')}{' '}
              <span className="text-accent">{t('services.titleAccent')}</span>
            </h2>
          </RevealItem>
          <RevealItem>
            <p className={styles.lead}>{t('services.lead')}</p>
          </RevealItem>
        </RevealGroup>

        <div className={styles.carouselWrap}>
          <div ref={trackRef} className={styles.track}>
            {items.map((item, i) => {
              const Icon = Icons[item.icon]
              const isActive = i === activeIdx
              return (
                <motion.article
                  key={item.title}
                  data-service-card={i}
                  className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VIEWPORT_TIGHT}
                  variants={{
                    hidden: fadeUp.hidden,
                    visible: {
                      ...fadeUp.visible,
                      transition: { ...fadeUp.visible.transition, delay: i * 0.06 },
                    },
                  }}
                  whileHover={{ y: -10, transition: { duration: 0.4, ease: EASE_SMOOTH } }}
                >
                  <div className={styles.cardBg} />
                  <div className={styles.cardShine} />
                  <div className={styles.cardTopGlow} />
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

        <div className={styles.footer}>
          <div className={styles.dots}>
            {items.map((item, i) => (
              <button
                key={item.title}
                type="button"
                className={`${styles.dot} ${i === activeIdx ? styles.dotActive : ''}`}
                onClick={() => scrollToCard(i)}
                aria-label={item.title}
              />
            ))}
          </div>
          <div className={styles.progressWrap}>
            <div className={styles.progressTrack}>
              <motion.div
                className={styles.progressBar}
                animate={{ scaleX: Math.max(progress, 0.06) }}
                transition={{ duration: 0.2, ease: EASE_SMOOTH }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
