import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AppleLogo,
  Sparkle,
  Camera,
  Microphone,
  FilePdf,
  Lightning,
  Star,
  ArrowSquareOut,
  Bell,
  CheckCircle,
} from '@phosphor-icons/react'
import styles from './AppShowcase.module.css'

const APP_STORE_URL =
  'https://apps.apple.com/tr/app/not-orta%C4%9F%C4%B1m-ai-not-asistan%C4%B1/id6758680814?l=tr'

const SCREEN_ROTATION_MS = 3400

const screens = [
  { src: '/app-screens/01-discover.png', label: 'Keşfet' },
  { src: '/app-screens/02-photo-mode.png', label: 'Foto Modu' },
  { src: '/app-screens/03-pdf.png', label: 'PDF Paylaş' },
  { src: '/app-screens/04-ai-teacher.png', label: 'AI Öğretmen' },
  { src: '/app-screens/05-photo-onboarding.png', label: 'Foto Çöz' },
  { src: '/app-screens/06-campaigns.png', label: 'Kampanyalar' },
]

const slideVariants = {
  enter: { opacity: 0, x: 60, scale: 0.96 },
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    x: -60,
    scale: 0.96,
    transition: { duration: 0.55, ease: [0.4, 0, 0.6, 1] },
  },
}

export default function AppShowcase() {
  const { t } = useTranslation()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setActive(prev => (prev + 1) % screens.length)
    }, SCREEN_ROTATION_MS)
    return () => clearInterval(id)
  }, [paused])

  // Preload screens
  useEffect(() => {
    screens.forEach(s => {
      const img = new Image()
      img.src = s.src
    })
  }, [])

  const features = t('appShowcase.features', { returnObjects: true }) || []
  const featureIcons = [Sparkle, Camera, Microphone, FilePdf]

  return (
    <section id="app" className={styles.section}>
      <div className={styles.bgGlow} />
      <div className={styles.bgGrid} />

      <div className={`container ${styles.container}`}>
        {/* LEFT — Copy */}
        <motion.div
          className={styles.left}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className={styles.badge}>
            <span className={styles.badgePulse} />
            <span>{t('appShowcase.badge')}</span>
          </div>

          <h2 className={styles.title}>
            <span className={styles.titleAccent}>{t('appShowcase.titleAccent')}</span>{' '}
            {t('appShowcase.titleEnd')}
          </h2>

          <p className={styles.subtitle}>{t('appShowcase.subtitle')}</p>

          <ul className={styles.bullets}>
            {features.map((label, i) => {
              const Icon = featureIcons[i] || Lightning
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.45 }}
                >
                  <span className={styles.bulletIcon}>
                    <Icon size={16} weight="fill" />
                  </span>
                  <span>{label}</span>
                </motion.li>
              )
            })}
          </ul>

          <div className={styles.storeRow}>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noreferrer"
              className={`${styles.storeBtn} ${styles.storeBtnPrimary}`}
              aria-label="App Store'dan indir"
            >
              <AppleLogo size={30} weight="fill" />
              <div className={styles.storeBtnText}>
                <span className={styles.storeBtnTop}>{t('appShowcase.storeTopApple')}</span>
                <span className={styles.storeBtnBottom}>App Store</span>
              </div>
              <ArrowSquareOut size={16} weight="bold" className={styles.storeBtnArrow} />
            </a>

            <div className={styles.androidPill}>
              <span className={styles.androidDot} />
              <span>{t('appShowcase.androidSoon')}</span>
            </div>
          </div>

          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <span className={styles.metaNum}>
                <Star size={14} weight="fill" /> 5.0
              </span>
              <span className={styles.metaLbl}>{t('appShowcase.metaRating')}</span>
            </div>
            <div className={styles.metaDivider} />
            <div className={styles.metaItem}>
              <span className={styles.metaNum}>4+</span>
              <span className={styles.metaLbl}>{t('appShowcase.metaAge')}</span>
            </div>
            <div className={styles.metaDivider} />
            <div className={styles.metaItem}>
              <span className={styles.metaNum}>{t('appShowcase.metaCategoryValue')}</span>
              <span className={styles.metaLbl}>{t('appShowcase.metaCategory')}</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — Phone */}
        <motion.div
          className={styles.right}
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className={styles.phoneStage}>
            {/* Floating notification cards */}
            <motion.div
              className={`${styles.floatCard} ${styles.floatCardA}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className={styles.floatIcon}>
                <Sparkle size={14} weight="fill" />
              </div>
              <div>
                <div className={styles.floatTitle}>{t('appShowcase.float1Title')}</div>
                <div className={styles.floatDesc}>{t('appShowcase.float1Desc')}</div>
              </div>
            </motion.div>

            <motion.div
              className={`${styles.floatCard} ${styles.floatCardB}`}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.85, duration: 0.6 }}
            >
              <div className={`${styles.floatIcon} ${styles.floatIconAlt}`}>
                <Microphone size={14} weight="fill" />
              </div>
              <div>
                <div className={styles.floatTitle}>{t('appShowcase.float2Title')}</div>
                <div className={styles.floatDesc}>{t('appShowcase.float2Desc')}</div>
              </div>
            </motion.div>

            <motion.div
              className={`${styles.floatCard} ${styles.floatCardC}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.05, duration: 0.6 }}
            >
              <div className={`${styles.floatIcon} ${styles.floatIconAlt2}`}>
                <CheckCircle size={14} weight="fill" />
              </div>
              <div>
                <div className={styles.floatTitle}>{t('appShowcase.float3Title')}</div>
                <div className={styles.floatDesc}>{t('appShowcase.float3Desc')}</div>
              </div>
            </motion.div>

            {/* Phone frame */}
            <div
              className={styles.phone}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className={styles.phoneShadow} />
              <div className={styles.phoneBody}>
                <div className={styles.phoneNotch}>
                  <div className={styles.phoneSpeaker} />
                  <div className={styles.phoneCamera} />
                </div>

                {/* Screen — real screenshots */}
                <div className={styles.phoneScreen}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.img
                      key={active}
                      src={screens[active].src}
                      alt={screens[active].label}
                      className={styles.screenImg}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      draggable={false}
                    />
                  </AnimatePresence>

                  {/* Soft glare */}
                  <span className={styles.screenGlare} aria-hidden="true" />

                  {/* Screen label pill */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`label-${active}`}
                      className={styles.screenLabel}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Sparkle size={11} weight="fill" />
                      <span>{screens[active].label}</span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Side buttons */}
              <div className={styles.phoneSideBtnL} />
              <div className={styles.phoneSideBtnL2} />
              <div className={styles.phoneSideBtnR} />
            </div>

            {/* Indicator dots */}
            <div className={styles.dots}>
              {screens.map((s, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
                  onClick={() => setActive(i)}
                  aria-label={s.label}
                />
              ))}
            </div>

            {/* Glow rings */}
            <div className={styles.ring1} />
            <div className={styles.ring2} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
