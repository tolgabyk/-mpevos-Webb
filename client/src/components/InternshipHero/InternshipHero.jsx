import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './InternshipHero.module.css'

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

const textVariants = {
  enter: { opacity: 0, y: 24 },
  center: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -24, transition: { duration: 0.4 } },
}

export default function InternshipHero() {
  const { t } = useTranslation()
  const canvasRef = useRef(null)
  const slides = t('internship.hero.slides', { returnObjects: true })
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!canvasRef.current) return
    return initParticles(canvasRef.current)
  }, [])

  useEffect(() => {
    if (!Array.isArray(slides) || slides.length <= 1) return
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % slides.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [slides])

  const current = Array.isArray(slides) ? slides[index] : { title: t('internship.hero.title'), subtitle: t('internship.hero.subtitle') }

  return (
    <section id="hero" className={styles.internship}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.glow} />
      <div className="grid-bg" />

      <motion.div
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.badge} variants={itemVariants}>
          <span className={styles.badgeDot} />
          <AnimatePresence mode="wait">
            <motion.span
              key={`badge-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {current.badge || t('internship.hero.badge')}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.div className={styles.titleWrap} variants={itemVariants}>
          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${index}`}
              className={styles.title}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {current.title}
              {current.titleAccent && (
                <>
                  {' '}<span className="text-accent">{current.titleAccent}</span>
                  {current.titleEnd && <> {' '}{current.titleEnd}</>}
                </>
              )}
            </motion.h1>
          </AnimatePresence>
        </motion.div>

        <motion.div className={styles.subtitleWrap} variants={itemVariants}>
          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${index}`}
              className={styles.subtitle}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {current.subtitle}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <motion.div className={styles.cta} variants={itemVariants}>
          <a href={current.cta1Link || '#internship-apply'} className="btn btn-primary">
            {current.cta1 || t('internship.hero.cta1')}
          </a>
          <a href={current.cta2Link || '#internship-details'} className="btn btn-secondary">
            {current.cta2 || t('internship.hero.cta2')}
          </a>
        </motion.div>

        <motion.div className={styles.scrollIndicator} variants={itemVariants}>
          <div className={styles.scrollLine} />
          <span>{t('internship.hero.scroll')}</span>
        </motion.div>
      </motion.div>
    </section>
  )
}
