import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useTypewriter } from '../../hooks/useTypewriter'
import styles from './Hero.module.css'

function initParticles(canvas) {
  const ctx = canvas.getContext('2d')
  let particles = []
  let animId

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  const createParticles = () => {
    particles = []
    const count = Math.floor((canvas.width * canvas.height) / 12000)
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      })
    }
  }

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(34, 197, 94, ${p.alpha})`
      ctx.fill()
    })
    // Lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100) {
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `rgba(34, 197, 94, ${0.04 * (1 - dist / 100)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }
    animId = requestAnimationFrame(draw)
  }

  resize()
  createParticles()
  draw()
  window.addEventListener('resize', () => { resize(); createParticles() })
  return () => {
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', resize)
  }
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
}

export default function Hero({ ready = true }) {
  const { t, i18n } = useTranslation()
  const canvasRef = useRef(null)
  const phrases = t('hero.typewriter', { returnObjects: true })
  const rotatingLines = useMemo(
    () => (Array.isArray(phrases) ? phrases : []),
    [i18n.language],
  )
  const rotatingText = useTypewriter(rotatingLines, 48, 2400)

  useEffect(() => {
    if (!canvasRef.current) return undefined
    return initParticles(canvasRef.current)
  }, [])

  return (
    <section id="hero" className={styles.hero}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.glow} />

      <motion.div
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        animate={ready ? 'visible' : 'hidden'}
      >
        <motion.div className={styles.badge} variants={itemVariants}>
          <span className={styles.badgeDot} />
          <span>{t('hero.badge', 'AI & MOBILE STARTUP STUDIO')}</span>
        </motion.div>

        <motion.h1 className={styles.title} variants={itemVariants}>
          {t('hero.titleBefore', 'The science behind the')} <span className="text-accent">{t('hero.titleAccent', 'next-gen apps.')}</span>
        </motion.h1>

        <motion.p className={styles.typewriter} variants={itemVariants} aria-live="polite">
          <span className={styles.typewriterText}>{rotatingText}</span>
          <span className={styles.cursor} aria-hidden="true" />
        </motion.p>

        <motion.p className={styles.subtitle} variants={itemVariants}>
          {t('hero.subtitle', 'Impevos is an autonomous product studio, building world-class AI and mobile apps using deep engineering, proprietary technology, and global growth systems.')}
        </motion.p>

        <motion.div className={styles.cta} variants={itemVariants}>
          <a href="#projects" className="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 14 16" fill="currentColor" style={{ marginRight: 2 }}>
              <path d="M3.38956.76009l9.55424 5.65086c1.2085.71374 1.2085 2.46363 0 3.17737l-9.55424 5.65088C2.159.967 1.5.078 1.5-1.35V2.35c0-1.43 1.555-2.32 2.786-1.59z" />
            </svg>
            <span>{t('hero.cta1', 'Discover Products')}</span>
          </a>
          <a href="#contact" className="btn btn-secondary">
            <span>{t('hero.cta2', 'Partner With Us')}</span>
          </a>
        </motion.div>

        <motion.div className={styles.statsStrip} variants={itemVariants}>
          <div className={styles.statsItem}>
            <strong>In-House</strong>
            <span>Product Studios</span>
          </div>
          <div className={styles.statsDivider} />
          <div className={styles.statsItem}>
            <strong>Global</strong>
            <span>Distribution</span>
          </div>
          <div className={styles.statsDivider} />
          <div className={styles.statsItem}>
            <strong>Proprietary</strong>
            <span>AI Architecture</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
