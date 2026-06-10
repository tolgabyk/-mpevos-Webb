import { useTranslation } from 'react-i18next'
import { motion, useScroll, useTransform } from 'framer-motion'
import CardStack from '../CardStack/CardStack'
import LightBulb from '../LightBulb/LightBulb'
import { RevealGroup, RevealItem } from '../Reveal/Reveal'
import { useRef } from 'react'
import styles from './About.module.css'

export default function About() {
  const { t } = useTranslation()
  const sectionRef = useRef(null)
  const stack = t('about.stack', { returnObjects: true })
  const items = stack.map((item, i) => ({ ...item, id: `about-${i}` }))

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['6%', '-6%'])

  return (
    <section id="about" ref={sectionRef} className={styles.section}>
      <div className={styles.bgGlow} />
      <motion.div className={styles.bgText} style={{ y: bgY }} aria-hidden="true">
        {t('about.label')}
      </motion.div>

      <div className="container">
        <RevealGroup className={styles.header}>
          <RevealItem>
            <span className={styles.label}>{t('about.label')}</span>
          </RevealItem>
          <RevealItem>
            <h2 className={styles.title}>
              {t('about.title')}{' '}
              <span className="text-accent">{t('about.titleAccent')}</span>
            </h2>
          </RevealItem>
          <RevealItem>
            <p className={styles.subtitle}>{t('about.subtitle')}</p>
          </RevealItem>
        </RevealGroup>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <CardStack
            items={items}
            showManualProgress
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
        </motion.div>
      </div>
    </section>
  )
}
