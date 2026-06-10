import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import styles from './CardStack.module.css'

const VISIBLE = 5
const SWIPE_THRESHOLD = 60

function getStackPosition(index, active, total) {
  let diff = index - active
  if (diff < 0) diff += total
  if (diff >= VISIBLE) return null
  return diff
}

export default function CardStack({
  items,
  autoPlay = false,
  autoPlayInterval = 4500,
  pauseOnHover = true,
  renderCard,
  visual,
  className = '',
}) {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)
  const touchStart = useRef(null)

  const total = items.length

  const goTo = useCallback((index, dir = 1) => {
    setDirection(dir)
    setActive((index + total) % total)
  }, [total])

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

  return (
    <div
      className={`${styles.stack} ${className}`}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={styles.deck}>
        {items.map((item, index) => {
          const pos = getStackPosition(index, active, total)
          if (pos === null) return null

          const isFront = pos === 0

          return (
            <motion.article
              key={item.id ?? index}
              className={`${styles.card} ${isFront ? styles.cardFront : ''}`}
              animate={{
                zIndex: total - pos,
                scale: 1 - pos * 0.038,
                y: pos * 18,
                x: pos * 6 * direction,
                opacity: isFront ? 1 : Math.max(0.25, 0.88 - pos * 0.14),
                rotateX: pos * -2,
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 28,
                mass: 0.9,
              }}
              style={{ transformOrigin: 'top center' }}
              onClick={() => !isFront && goTo(index, index > active ? 1 : -1)}
            >
              <div className={styles.cardInner}>
                {renderCard(item, isFront, index)}
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
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {typeof visual === 'function' ? visual(active, items[active]) : visual}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      <div className={styles.controls}>
        <button type="button" className={styles.navBtn} onClick={goPrev} aria-label="Önceki">
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

        <button type="button" className={styles.navBtn} onClick={goNext} aria-label="Sonraki">
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
    </div>
  )
}
