import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCountUp } from '../../hooks/useCountUp'
import styles from './Stats.module.css'

const ITEMS = [
  { key: 'products', value: 3, suffix: '+' },
  { key: 'users', value: 150, suffix: 'K+' },
  { key: 'countries', value: 80, suffix: '+' },
  { key: 'queries', value: 10, suffix: 'M+' },
]

function Stat({ value, label, suffix = '' }) {
  const ref = useRef(null)
  const [start, setStart] = useState(false)
  const count = useCountUp(value, value > 2000 ? 900 : 1200, start)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setStart(true)
    }, { threshold: 0.5 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={styles.item}>
      <span className={styles.value}>{start ? count : 0}{suffix}</span>
      <span className={styles.label}>{label}</span>
    </div>
  )
}

export default function Stats() {
  const { t } = useTranslation()

  return (
    <section id="stats" className={styles.section} aria-labelledby="stats-title">
      <div className="container">
        <div className="section-header">
          <div className="section-label">{t('stats.label')}</div>
          <h2 id="stats-title" className="section-title">{t('stats.title')}</h2>
        </div>
        <div className={styles.row}>
          {ITEMS.map((item) => (
            <Stat key={item.key} value={item.value} suffix={item.suffix} label={t(`stats.${item.key}`)} />
          ))}
        </div>
      </div>
    </section>
  )
}
