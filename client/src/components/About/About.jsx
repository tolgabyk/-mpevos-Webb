import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useInView } from 'framer-motion'
import { Buildings } from '@phosphor-icons/react'
import { useCountUp } from '../../hooks/useCountUp'
import styles from './About.module.css'

function MetricCard({ value, suffix, label }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const count = useCountUp(value, 2000, inView)
  return (
    <motion.div
      ref={ref}
      className={styles.metricCard}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.metricValue}>{count}{suffix}</div>
      <div className={styles.metricLabel}>{label}</div>
    </motion.div>
  )
}

const fadeLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25,0.46,0.45,0.94] } } }
const fadeRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25,0.46,0.45,0.94] } } }

export default function About() {
  const { t } = useTranslation()
  const metrics = t('about', { returnObjects: true })

  return (
    <section id="about">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-label">{t('about.label')}</div>
          <h2 className="section-title">
            {t('about.title')}<br />
            <span className="text-accent">{t('about.titleAccent')}</span>
          </h2>
          <p className="section-subtitle">{t('about.subtitle')}</p>
        </motion.div>

        <div className={styles.content}>
          {/* Left: Text */}
          <motion.div
            className={styles.text}
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <h3>{t('about.h3')}</h3>
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
          </motion.div>

          {/* Right: Metrics */}
          <motion.div
            className={styles.metricsWrap}
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className={styles.metricsGrid}>
              {['metric1','metric2','metric3','metric4'].map(k => {
                const m = t(`about.${k}`, { returnObjects: true })
                return <MetricCard key={k} value={m.value} suffix={m.suffix} label={m.label} />
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
