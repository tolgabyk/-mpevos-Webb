import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import CardStack from '../CardStack/CardStack'
import LightBulb from '../LightBulb/LightBulb'
import styles from './About.module.css'

export default function About() {
  const { t } = useTranslation()
  const stack = t('about.stack', { returnObjects: true })

  const items = stack.map((item, i) => ({ ...item, id: `about-${i}` }))

  return (
    <section id="about" className={styles.section}>
      <div className={styles.bgGlow} />
      <div className={styles.bgText} aria-hidden="true">{t('about.label')}</div>

      <div className="container">
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.label}>{t('about.label')}</span>
          <h2 className={styles.title}>
            {t('about.title')}{' '}
            <span className="text-accent">{t('about.titleAccent')}</span>
          </h2>
          <p className={styles.subtitle}>{t('about.subtitle')}</p>
        </motion.header>

        <CardStack
          items={items}
          visual={() => <LightBulb active size="lg" />}
          renderCard={(item, isFront) => (
            <div className={styles.cardContent}>
              <div className={`${styles.cardBg} ${styles[`tone${item.tone ?? 0}`]}`} />
              <div className={styles.cardBody}>
                <span className={styles.tag}>{item.tag}</span>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                {item.lead && <p className={styles.lead}>{item.lead}</p>}
                <div className={styles.cols}>
                  {item.body && <p className={styles.body}>{item.body}</p>}
                  {item.body2 && <p className={styles.bodyMuted}>{item.body2}</p>}
                </div>
              </div>
              {isFront && <div className={styles.cardGlow} />}
            </div>
          )}
        />
      </div>
    </section>
  )
}
