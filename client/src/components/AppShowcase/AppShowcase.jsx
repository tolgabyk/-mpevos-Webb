import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AppleLogo,
  GooglePlayLogo,
  Sparkle,
  Camera,
  Microphone,
  FilePdf,
  Lightning,
  Star,
  ArrowSquareOut,
  ArrowRight,
  Compass,
} from '@phosphor-icons/react'
import styles from './AppShowcase.module.css'
import { NOT_ORTAGIM_SCREENS as screens } from '../../data/notOrtagimScreens'
import { EASE_SMOOTH, mockupSlide, contentSlide } from '../../utils/motion'

const APP_STORE_URL =
  'https://apps.apple.com/tr/app/not-orta%C4%9F%C4%B1m-ai-not-asistan%C4%B1/id6758680814?l=tr'

const GOOGLE_PLAY_URL =
  'https://play.google.com/store/apps/details?id=com.notortagim.android'

const SCREEN_ROTATION_MS = 3400
const HUB_INTERVAL = 5000

const CHIP_ICONS = { Sparkle, Compass, Microphone, Camera, FilePdf, Lightning }

const HUB_PATHS = [
  'M 4 52 Q 50 52 58 160',
  'M 4 160 L 58 160',
  'M 4 268 Q 50 268 58 160',
]

function useSlideDirection(active) {
  const prev = useRef(active)
  const direction = active >= prev.current ? 1 : -1
  useEffect(() => {
    prev.current = active
  }, [active])
  return direction
}

function HubConnectors({ active }) {
  return (
    <svg
      className={styles.hubSvg}
      viewBox="0 0 120 320"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {HUB_PATHS.map((d, i) => (
        <path
          key={d}
          d={d}
          className={`${styles.hubPath} ${i === active ? styles.hubPathActive : ''}`}
        />
      ))}
      <path d="M 58 160 L 116 160" className={styles.hubPathOut} />
    </svg>
  )
}

function PhoneMockup({
  active,
  direction,
  compact = false,
  onMouseEnter,
  onMouseLeave,
  showDots = true,
  onDotClick,
}) {
  const screen = screens[active]

  return (
    <div className={styles.phoneWrap}>
      <div
        className={`${styles.phone} ${compact ? styles.phoneCompact : ''}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className={styles.phoneShadow} />
        <div className={styles.phoneBody}>
          <div className={styles.phoneNotch}>
            <div className={styles.phoneCamera} />
          </div>

          <div className={styles.phoneScreen}>
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.img
                key={screen.src}
                src={screen.src}
                alt={screen.label}
                className={styles.screenImg}
                custom={direction}
                variants={mockupSlide}
                initial="enter"
                animate="center"
                exit="exit"
                draggable={false}
                decoding="async"
                width={470}
                height={1024}
              />
            </AnimatePresence>

          </div>
        </div>

        <div className={styles.phoneSideBtnL} />
        <div className={styles.phoneSideBtnL2} />
        <div className={styles.phoneSideBtnR} />
      </div>

      {showDots && (
        <div className={styles.dots}>
          {screens.map((s, i) => (
            <button
              key={s.src}
              type="button"
              className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
              onClick={() => onDotClick?.(i)}
              aria-label={s.label}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function AppShowcase() {
  const { t } = useTranslation()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hubActive, setHubActive] = useState(0)
  const [hubPaused, setHubPaused] = useState(false)

  const hubSteps = t('appShowcase.scrollSteps', { returnObjects: true }) || []
  const heroDirection = useSlideDirection(active)
  const hubDirection = useSlideDirection(hubActive)
  const hubScreenIndex = hubSteps[hubActive]?.screen ?? 0
  const currentHubStep = hubSteps[hubActive]

  useEffect(() => {
    if (paused) return undefined
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % screens.length)
    }, SCREEN_ROTATION_MS)
    return () => clearInterval(id)
  }, [paused])

  useEffect(() => {
    if (hubPaused || !Array.isArray(hubSteps) || hubSteps.length <= 1) return undefined
    const id = setInterval(() => {
      setHubActive((prev) => (prev + 1) % hubSteps.length)
    }, HUB_INTERVAL)
    return () => clearInterval(id)
  }, [hubPaused, hubSteps.length])

  useEffect(() => {
    screens.forEach((s) => {
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
      <div className={styles.noiseA} aria-hidden="true" />
      <div className={styles.noiseB} aria-hidden="true" />

      <div className={`container ${styles.container}`}>
        <motion.div
          className={styles.left}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE_SMOOTH }}
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
                  key={label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: EASE_SMOOTH }}
                >
                  <span className={styles.bulletIcon}>
                    <Icon size={16} weight="fill" />
                  </span>
                  <span>{label}</span>
                </motion.li>
              )
            })}
          </ul>

          <motion.a
            href="https://www.notortagim.com"
            target="_blank"
            rel="noreferrer"
            className={styles.minimalUpdateLink}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className={styles.liveDot} />
            <span className={styles.updateText}>{t('appShowcase.updateShort')}</span>
            <ArrowRight size={16} weight="bold" className={styles.updateArrow} />
          </motion.a>

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

            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noreferrer"
              className={styles.storeBtn}
              aria-label="Google Play'den indir"
            >
              <GooglePlayLogo size={30} weight="fill" />
              <div className={styles.storeBtnText}>
                <span className={styles.storeBtnTop}>{t('appShowcase.storeTopGoogle')}</span>
                <span className={styles.storeBtnBottom}>Google Play</span>
              </div>
              <ArrowSquareOut size={16} weight="bold" className={styles.storeBtnArrow} />
            </a>
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

        <motion.div
          className={styles.right}
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: EASE_SMOOTH }}
        >
          <div className={styles.phoneStage}>
            <PhoneMockup
              active={active}
              direction={heroDirection}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onDotClick={setActive}
            />

          </div>
        </motion.div>
      </div>

      {/* Mehir-style unified hub: chips + connectors + mockup side-by-side */}
      {Array.isArray(hubSteps) && hubSteps.length > 0 && (
        <div
          className={styles.hubShowcase}
          onMouseEnter={() => setHubPaused(true)}
          onMouseLeave={() => setHubPaused(false)}
        >
          <div className="container">
            <motion.div
              className={styles.hubHeader}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: EASE_SMOOTH }}
            >
              <span className={styles.scrollLabel}>{t('appShowcase.scrollLabel')}</span>
              <h3 className={styles.scrollTitle}>
                {t('appShowcase.scrollTitle')}{' '}
                <span className={styles.titleAccent}>{t('appShowcase.scrollTitleAccent')}</span>
              </h3>
              <p className={styles.hubSubtitle}>{t('appShowcase.scrollSubtitle')}</p>
            </motion.div>

            <div className={styles.hubPanel}>
              <div className={styles.hubLeft}>
                <div className={styles.chipGrid}>
                  {hubSteps.map((step, i) => {
                    const Icon = CHIP_ICONS[step.icon] || Sparkle
                    return (
                      <button
                        key={step.title}
                        type="button"
                        className={`${styles.chip} ${styles[`chipPos${i}`]} ${i === hubActive ? styles.chipActive : ''}`}
                        onClick={() => setHubActive(i)}
                        aria-label={step.title}
                      >
                        <span className={styles.chipIcon}>
                          <Icon size={18} weight="duotone" />
                        </span>
                        <span className={styles.chipLabel}>{step.chip}</span>
                      </button>
                    )
                  })}
                </div>

                <div className={styles.hubContent}>
                  <AnimatePresence mode="wait" custom={hubDirection}>
                    {currentHubStep && (
                      <motion.div
                        key={hubActive}
                        custom={hubDirection}
                        variants={contentSlide}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className={styles.hubContentInner}
                      >
                        <div className={styles.stepMeta}>
                          <span className={styles.stepNum}>0{hubActive + 1}</span>
                          <span className={styles.stepLine} aria-hidden="true" />
                        </div>
                        <h4 className={styles.stepTitle}>{currentHubStep.title}</h4>
                        <p className={styles.stepDesc}>{currentHubStep.desc}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className={styles.hubCenter}>
                <HubConnectors active={hubActive} />
                <div className={styles.hubLogo}>
                  <Lightning size={28} weight="fill" />
                </div>
              </div>

              <div className={styles.hubRight}>
                <div className={styles.hubPhoneStage}>
                  <PhoneMockup
                    active={hubScreenIndex}
                    direction={hubDirection}
                    compact
                    showDots={false}
                  />
                </div>

                <div className={styles.stepTabs}>
                  {hubSteps.map((step, i) => (
                    <button
                      key={step.title}
                      type="button"
                      className={`${styles.stepTab} ${i === hubActive ? styles.stepTabActive : ''}`}
                      onClick={() => setHubActive(i)}
                      aria-label={step.title}
                    >
                      0{i + 1}
                    </button>
                  ))}
                </div>

                <div className={styles.hubProgressTrack}>
                  <motion.div
                    key={hubActive}
                    className={styles.hubProgress}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: HUB_INTERVAL / 1000, ease: 'linear' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
