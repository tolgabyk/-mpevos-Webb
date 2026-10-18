import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Cube, Code, Brain, GearSix } from '@phosphor-icons/react'
import { EASE_SMOOTH } from '../../utils/motion'
import styles from './WhoWeAre.module.css'

const PILLAR_ICONS = { Cube, Code, Brain, GearSix }

export default function WhoWeAre() {
  const { t } = useTranslation()
  const facts = t('whoWeAre.facts', { returnObjects: true }) || []
  const pillars = t('whoWeAre.pillars', { returnObjects: true }) || []

  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className="container">
        <div className={styles.top}>
          <motion.div
            className={styles.intro}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: EASE_SMOOTH }}
          >
            <div className="section-label">{t('whoWeAre.label')}</div>
            <h2 id="about-title" className={styles.title}>{t('whoWeAre.title')}</h2>
            <p className={styles.lead}>{t('whoWeAre.lead')}</p>
            <p className={styles.body}>{t('whoWeAre.body')}</p>
            <div style={{ marginTop: 28 }}>
              <a href="#projects" className="btn btn-primary">
                <span>{t('whoWeAre.cta', 'Discover Products')}</span>
              </a>
            </div>
          </motion.div>

          {Array.isArray(facts) && facts.length > 0 && (
            <motion.dl
              className={styles.facts}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.1, duration: 0.6, ease: EASE_SMOOTH }}
            >
              {facts.map(fact => (
                <div key={fact.label} className={styles.fact}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </motion.dl>
          )}
        </div>

        {Array.isArray(pillars) && pillars.length > 0 && (
          <div className={styles.pillars}>
            {pillars.map((pillar, i) => {
              const Icon = PILLAR_ICONS[pillar.icon] || Cube
              return (
                <motion.article
                  key={pillar.title}
                  className={styles.pillar}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: 0.05 * i, duration: 0.5, ease: EASE_SMOOTH }}
                >
                  <span className={styles.pillarIcon}>
                    <Icon size={22} weight="duotone" />
                  </span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.desc}</p>
                </motion.article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
