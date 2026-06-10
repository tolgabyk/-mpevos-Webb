import { useEffect, useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  AppleLogo,
  Sparkle,
  Camera,
  Microphone,
  FilePdf,
  Lightning,
  Star,
  ArrowSquareOut,
  CheckCircle,
  ArrowRight,
} from '@phosphor-icons/react'
import styles from './AppShowcase.module.css'
import { NOT_ORTAGIM_SCREENS as screens } from '../../data/notOrtagimScreens'
import { EASE_SMOOTH, mockupSlide } from '../../utils/motion'

const APP_STORE_URL =
  'https://apps.apple.com/tr/app/not-orta%C4%9F%C4%B1m-ai-not-asistan%C4%B1/id6758680814?l=tr'

const SCREEN_ROTATION_MS = 3400

function useSlideDirection(active) {
  const prev = useRef(active)
  const direction = active >= prev.current ? 1 : -1
  useEffect(() => {
    prev.current = active
  }, [active])
  return direction
}

function useScrollActiveStep(stepCount) {
  const stepRefs = useRef([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    stepRefs.current = stepRefs.current.slice(0, stepCount)
  }, [stepCount])

  useEffect(() => {
    const elements = stepRefs.current.filter(Boolean)
    if (!elements.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (best) setActive(Number(best.target.dataset.index))
      },
      { threshold: [0.35, 0.5, 0.65], rootMargin: '-38% 0px -38% 0px' }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [stepCount])

  const setStepRef = useCallback(
    (index) => (el) => {
      stepRefs.current[index] = el
    },
    []
  )

  return { active, setStepRef }
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
            <div className={styles.phoneSpeaker} />
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
                width={390}
                height={844}
              />
            </AnimatePresence>

            <span className={styles.screenGlare} aria-hidden="true" />

            <AnimatePresence mode="wait">
              <motion.div
                key={`label-${active}`}
                className={styles.screenLabel}
                initial={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
                transition={{ duration: 0.45, ease: EASE_SMOOTH }}
              >
                <Sparkle size={11} weight="fill" />
                <span>{screen.label}</span>
              </motion.div>
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
  const scrollRef = useRef(null)

  const scrollSteps = t('appShowcase.scrollSteps', { returnObjects: true }) || []
  const { active: scrollActive, setStepRef } = useScrollActiveStep(scrollSteps.length)

  const heroDirection = useSlideDirection(active)
  const scrollDirection = useSlideDirection(scrollActive)
  const scrollScreenIndex = scrollSteps[scrollActive]?.screen ?? 0

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start end', 'end start'],
  })
  const mockupY = useTransform(scrollYProgress, [0, 1], [40, -40])
  const mockupRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-2, 0, 2])

  useEffect(() => {
    if (paused) return undefined
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % screens.length)
    }, SCREEN_ROTATION_MS)
    return () => clearInterval(id)
  }, [paused])

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

        <motion.div
          className={styles.right}
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: EASE_SMOOTH }}
        >
          <div className={styles.phoneStage}>
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

            <PhoneMockup
              active={active}
              direction={heroDirection}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onDotClick={setActive}
            />

            <div className={styles.ring1} />
            <div className={styles.ring2} />
          </div>
        </motion.div>
      </div>

      {/* Mehir-style scroll-driven mockup section */}
      {Array.isArray(scrollSteps) && scrollSteps.length > 0 && (
        <div className={styles.scrollShowcase} ref={scrollRef}>
          <div className="container">
            <motion.div
              className={styles.scrollHeader}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: EASE_SMOOTH }}
            >
              <span className={styles.scrollLabel}>{t('appShowcase.scrollLabel')}</span>
              <h3 className={styles.scrollTitle}>
                {t('appShowcase.scrollTitle')}{' '}
                <span className={styles.titleAccent}>{t('appShowcase.scrollTitleAccent')}</span>
              </h3>
            </motion.div>

            <div className={styles.scrollGrid}>
              <div className={styles.stepsCol}>
                {scrollSteps.map((step, i) => (
                  <article
                    key={step.title}
                    ref={setStepRef(i)}
                    data-index={i}
                    className={`${styles.stepBlock} ${i === scrollActive ? styles.stepBlockActive : ''}`}
                  >
                    <div className={styles.stepMeta}>
                      <span className={styles.stepNum}>0{i + 1}</span>
                      <span className={styles.stepLine} aria-hidden="true" />
                    </div>
                    <motion.h4
                      className={styles.stepTitle}
                      animate={{ opacity: i === scrollActive ? 1 : 0.45 }}
                      transition={{ duration: 0.45 }}
                    >
                      {step.title}
                    </motion.h4>
                    <motion.p
                      className={styles.stepDesc}
                      animate={{ opacity: i === scrollActive ? 1 : 0.35 }}
                      transition={{ duration: 0.45 }}
                    >
                      {step.desc}
                    </motion.p>
                  </article>
                ))}
              </div>

              <div className={styles.mockupCol}>
                <motion.div
                  className={styles.stickyMockup}
                  style={{ y: mockupY, rotate: mockupRotate }}
                >
                  <div className={styles.stickyStage}>
                    <PhoneMockup
                      active={scrollScreenIndex}
                      direction={scrollDirection}
                      compact
                      showDots={false}
                    />
                    <div className={styles.stepTabs}>
                      {scrollSteps.map((step, i) => (
                        <button
                          key={step.title}
                          type="button"
                          className={`${styles.stepTab} ${i === scrollActive ? styles.stepTabActive : ''}`}
                          onClick={() => stepRefsScrollTo(i)}
                          aria-label={step.title}
                        >
                          0{i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function stepRefsScrollTo(index) {
  document.querySelector(`[data-index="${index}"]`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}
