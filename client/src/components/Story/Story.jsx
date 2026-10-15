import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import styles from './Story.module.css'

export default function Story() {
  const { t } = useTranslation()
  const events = t('story.events', { returnObjects: true }) || []

  return (
    <section id="story" className={styles.section} aria-labelledby="story-title">
      <div className="container">
        <div className={styles.grid}>
          <div>
            <div className="section-label">{t('story.label')}</div>
            <h2 id="story-title" className="section-title">{t('story.title')}</h2>
            <p className={styles.lead}>{t('story.subtitle')}</p>
            <ol className={styles.timeline}>
              {events.map((event) => (
                <li key={event.title}>
                  <p className={styles.date}>{event.date}</p>
                  <h3>{event.title}</h3>
                  <p>{event.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <motion.div
            className={styles.video}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <span className={styles.play} aria-hidden="true">▶</span>
            <p className={styles.videoTitle}>{t('story.videoTitle')}</p>
            <p className={styles.videoText}>{t('story.videoText')}</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
