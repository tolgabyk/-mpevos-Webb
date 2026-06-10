import { useRef, useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import * as Icons from '@phosphor-icons/react'
import { RevealGroup, RevealItem } from '../Reveal/Reveal'
import { EASE_SMOOTH, fadeUp, VIEWPORT_TIGHT } from '../../utils/motion'
import styles from './Services.module.css'

const AUTO_INTERVAL = 4500
const GAP = 20

export default function Services() {
  const { t } = useTranslation()
  const items = t('services.items', { returnObjects: true })
  const wrapRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [step, setStep] = useState(340)

  const measure = useCallback(() => {
    const card = wrapRef.current?.querySelector('[data-service-card]')
    if (card) setStep(card.offsetWidth + GAP)
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure, items.length])

  useEffect(() => {
    if (!Array.isArray(items) || items.length <= 1) return undefined

    const id = window.setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % items.length)
    }, AUTO_INTERVAL)

    return () => window.clearInterval(id)
  }, [items.length])

  const goTo = (index) => setActiveIdx(index)

  return (
    <section id="services" className={styles.section}>
      <div className={styles.bgGlow} />

      <div className="container">
        <RevealGroup className={styles.header}>
          <RevealItem>
            <span className={styles.label}>{t('services.label')}</span>
          </RevealItem>
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

        <div
          ref={wrapRef}
          className={styles.carouselWrap}
        >
          <div className={styles.fadeLeft} aria-hidden="true" />
          <div className={styles.fadeRight} aria-hidden="true" />

          <motion.div
            className={styles.track}
            animate={{ x: -activeIdx * step }}
            transition={{ duration: 0.85, ease: EASE_SMOOTH }}
          >
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
                      transition: { ...fadeUp.visible.transition, delay: i * 0.04 },
                    },
                  }}
                  animate={{
                    scale: isActive ? 1 : 0.96,
                    opacity: isActive ? 1 : 0.6,
                  }}
                  transition={{ duration: 0.6, ease: EASE_SMOOTH }}
                  onClick={() => goTo(i)}
                >
                  <div className={styles.cardBg} />
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
          </motion.div>
        </div>

        <div className={styles.footer}>
          <div className={styles.dots}>
            {items.map((item, i) => (
              <button
                key={item.title}
                type="button"
                className={`${styles.dot} ${i === activeIdx ? styles.dotActive : ''}`}
                onClick={() => goTo(i)}
                aria-label={item.title}
              />
            ))}
          </div>
          <div className={styles.progressWrap}>
            <div className={styles.progressTrack}>
              <div
                key={activeIdx}
                className={styles.autoProgress}
                style={{ animationDuration: `${AUTO_INTERVAL}ms` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
