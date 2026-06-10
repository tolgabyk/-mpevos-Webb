export const EASE_SMOOTH = [0.22, 1, 0.36, 1]
export const EASE_CURTAIN = [0.76, 0, 0.24, 1]
export const EASE_SPRING = { type: 'spring', stiffness: 260, damping: 28, mass: 0.9 }

export const VIEWPORT = { once: true, margin: '-80px' }
export const VIEWPORT_TIGHT = { once: true, margin: '-40px' }

export const fadeUp = {
  hidden: { opacity: 0, y: 44 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE_SMOOTH },
  },
}

export const fadeUpItem = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE_SMOOTH },
  },
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: EASE_SMOOTH },
  },
}
