import { useEffect, useRef } from 'react'
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
      ctx.fillStyle = `rgba(0, 255, 0, ${p.alpha})`
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
          ctx.strokeStyle = `rgba(0, 255, 0, ${0.04 * (1 - dist / 100)})`
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
  const { t } = useTranslation()
  const canvasRef = useRef(null)
  const phrases = t('hero.typewriter', { returnObjects: true })
  const typed = useTypewriter(ready ? phrases : [], 48, 2400)

  useEffect(() => {
    if (!canvasRef.current) return
    return initParticles(canvasRef.current)
  }, [])

  return (
    <section id="hero" className={styles.hero}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.glow} />
      <div className="grid-bg" />

      <motion.div
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        animate={ready ? 'visible' : 'hidden'}
      >
        <motion.div className={styles.badge} variants={itemVariants}>
          <span className={styles.badgeDot} />
          <span>{t('hero.badge')}</span>
        </motion.div>

        <motion.h1 className={styles.title} variants={itemVariants}>
          {t('hero.title')}<br />
          <span className="text-accent">{t('hero.titleAccent')}</span>
          {' '}{t('hero.titleEnd')}
        </motion.h1>

        <motion.p className={styles.typewriter} variants={itemVariants}>
          <span className={styles.typewriterText}>{typed}</span>
          <span className={styles.cursor} aria-hidden="true" />
        </motion.p>

        <motion.p className={styles.subtitle} variants={itemVariants}>
          {t('hero.subtitle')}
        </motion.p>

        <motion.div className={styles.cta} variants={itemVariants}>
          <a href="#projects" className="btn btn-primary">{t('hero.cta1')}</a>
          <a href="#contact" className="btn btn-secondary">{t('hero.cta2')}</a>
        </motion.div>


      </motion.div>
    </section>
  )
}
