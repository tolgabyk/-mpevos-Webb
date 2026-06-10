import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { EASE_SMOOTH, EASE_SPRING } from '../../utils/motion'
import styles from './CardStack.module.css'

const SWIPE_THRESHOLD = 60
const DRAG_THRESHOLD = 70
const TAB_HEIGHT = 54
const STAGGER_X = 14

function getStackPosition(index, active, total) {
  let diff = index - active
  if (diff < 0) diff += total
  return diff
}

function getDeckLayout(pos, visibleCount) {
  return {
    top: (visibleCount - 1 - pos) * TAB_HEIGHT,
    left: pos * STAGGER_X,
    right: pos * STAGGER_X,
    scale: 1 - pos * 0.022,
    zIndex: visibleCount - pos,
  }
}

export default function CardStack({
  items,
  autoPlay = false,
  autoPlayInterval = 4500,
  pauseOnHover = true,
  renderCard,
  visual,
  className = '',
  deckClassName = '',
  showManualProgress = false,
  variant = 'accent',
  stackDepth = 6,
  fullWidth = false,
  stackMode = 'default',
}) {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)
  const [exiting, setExiting] = useState(false)
  const touchStart = useRef(null)

  const total = items.length
  const visibleCount = Math.min(stackDepth, total)
  const isDeck = stackMode === 'deck'

  const goTo = useCallback((index, dir = 1) => {
    if (exiting) return
    const next = (index + total) % total
    if (next === active) return
    setDirection(dir)
    setExiting(true)
    setTimeout(() => {
      setActive(next)
      setExiting(false)
    }, 320)
  }, [active, exiting, total])

  const goNext = useCallback(() => goTo(active + 1, 1), [active, goTo])
  const goPrev = useCallback(() => goTo(active - 1, -1), [active, goTo])

  useEffect(() => {
    if (!autoPlay || paused || total <= 1) return undefined
    const id = setInterval(goNext, autoPlayInterval)
    return () => clearInterval(id)
  }, [autoPlay, paused, goNext, autoPlayInterval, total])

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX
  }

  const onTouchEnd = (e) => {
    if (touchStart.current == null) return
    const delta = e.changedTouches[0].clientX - touchStart.current
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta < 0) goNext()
      else goPrev()
    }
    touchStart.current = null
  }

  const onDragEnd = (_, info) => {
    if (info.offset.x < -DRAG_THRESHOLD) goNext()
    else if (info.offset.x > DRAG_THRESHOLD) goPrev()
  }

  const deckStyle = isDeck
    ? { '--stack-tabs': visibleCount - 1, '--tab-height': `${TAB_HEIGHT}px` }
    : undefined

  return (
    <div
      className={`${styles.stack} ${visual ? '' : (!fullWidth && styles.stackSingle)} ${isDeck ? styles.stackDeck : ''} ${className}`}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className={`${styles.deck} ${deckClassName} ${isDeck ? styles.deckLayered : ''}`}
        style={deckStyle}
      >
        {items.map((item, index) => {
          const pos = getStackPosition(index, active, total)
          if (pos >= visibleCount) return null

          const isFront = pos === 0
          const isLeaving = isFront && exiting
          const deckLayout = isDeck ? getDeckLayout(pos, visibleCount) : null

          let animateProps
          if (isLeaving) {
            animateProps = {
              x: direction > 0 ? -160 : 160,
              opacity: 0,
              scale: 0.96,
              rotateZ: direction > 0 ? -5 : 5,
              zIndex: total + 1,
            }
          } else if (isDeck && deckLayout) {
            animateProps = {
              top: deckLayout.top,
              left: deckLayout.left,
              right: deckLayout.right,
              scale: deckLayout.scale,
              zIndex: deckLayout.zIndex,
              x: 0,
              opacity: 1,
              rotateZ: 0,
              rotateX: 0,
            }
          } else {
            animateProps = {
              zIndex: total - pos,
              scale: 1 - pos * 0.048,
              y: pos * 28,
              x: pos * 14,
              opacity: isFront ? 1 : Math.max(0.35, 0.92 - pos * 0.11),
              rotateX: pos * -1.5,
              rotateZ: pos * 0.4,
              filter: isFront ? 'brightness(1)' : `brightness(${0.78 - pos * 0.07})`,
            }
          }

          return (
            <motion.article
              key={item.id ?? index}
              className={`${styles.card} ${isDeck ? styles.cardDeck : ''} ${variant === 'glass' ? styles.cardGlass : ''} ${isFront ? styles.cardFront : styles.cardBack} ${isDeck && !isFront ? styles.cardTab : ''}`}
              animate={animateProps}
              transition={isLeaving ? { duration: 0.32, ease: EASE_SMOOTH } : EASE_SPRING}
              style={{ transformOrigin: isDeck ? 'top center' : 'top center' }}
              drag={isFront && !exiting ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={isFront ? onDragEnd : undefined}
              onClick={() => !isFront && !exiting && goTo(index, index > active ? 1 : -1)}
              whileTap={isFront && !exiting ? { scale: 0.995 } : undefined}
            >
              <div className={styles.cardInner}>
                {renderCard(item, isFront, index, active)}
              </div>
            </motion.article>
          )
        })}
      </div>

      {visual && (
        <div className={styles.visualSlot}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.88, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.92, rotate: 8 }}
              transition={{ duration: 0.55, ease: EASE_SMOOTH }}
            >
              {typeof visual === 'function' ? visual(active, items[active]) : visual}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      <div className={styles.controls}>
        <button type="button" className={styles.navBtn} onClick={goPrev} disabled={exiting} aria-label="Önceki">
          <CaretLeft size={20} weight="bold" />
        </button>

        <div className={styles.dots}>
          {items.map((item, i) => (
            <button
              key={item.id ?? i}
              type="button"
              className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
              onClick={() => goTo(i, i > active ? 1 : -1)}
              aria-label={`Kart ${i + 1}`}
            />
          ))}
        </div>

        <button type="button" className={styles.navBtn} onClick={goNext} disabled={exiting} aria-label="Sonraki">
          <CaretRight size={20} weight="bold" />
        </button>
      </div>

      {autoPlay && (
        <div className={styles.autoBar}>
          <div
            key={active}
            className={`${styles.autoProgress} ${paused ? styles.autoPaused : ''}`}
            style={{ animationDuration: `${autoPlayInterval}ms` }}
          />
        </div>
      )}

      {showManualProgress && !autoPlay && total > 1 && (
        <div className={styles.manualBar}>
          <motion.div
            className={styles.manualProgress}
            animate={{ scaleX: (active + 1) / total }}
            transition={{ duration: 0.45, ease: EASE_SMOOTH }}
          />
        </div>
      )}
    </div>
  )
}
