import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Check, UserFocus, Compass, Stack, CalendarBlank, HandHeart } from '@phosphor-icons/react'
import styles from './InternshipDetails.module.css'

export default function InternshipDetails() {
  const { t } = useTranslation()
  const intro = t('internship.details.intro', { returnObjects: true })
  const eligible = t('internship.details.eligible', { returnObjects: true })
  const areas = t('internship.details.areas', { returnObjects: true })
  const expectations = t('internship.expectations.items', { returnObjects: true })
  const notice = t('internship.details.notice', { returnObjects: true })
  const stats = t('internship.details.stats', { returnObjects: true })
  const support = t('internship.details.support', { returnObjects: true })

  return (
    <section id="internship-details" className={styles.sectionWrapper}>
      {/* Decorative Glowing Background */}
      <div className={styles.glowBg}></div>
      
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="section-label">{t('internship.details.label')}</div>
          <h2 className="section-title">
            {t('internship.details.title')}
          </h2>
          <div className={styles.introCentered}>
            {intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </motion.div>

        {notice?.title && (
          <motion.div
            className={styles.notice}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className={styles.noticeIcon}>
              <CalendarBlank weight="duotone" />
            </div>
            <div className={styles.noticeText}>
              <span className={styles.noticeBadge}>{notice.badge}</span>
              <h3>{notice.title}</h3>
              <p>{notice.desc}</p>
            </div>
          </motion.div>
        )}

        {Array.isArray(stats) && stats.length > 0 && (
          <div className={styles.stats}>
            {stats.map(stat => (
              <div key={stat.label} className={styles.stat}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.grid}>
          <motion.div
            className={styles.block}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
          >
            <div className={styles.blockHeader}>
              <div className={styles.iconWrapper}>
                <UserFocus weight="light" />
              </div>
              <h3>{t('internship.details.eligibleTitle')}</h3>
            </div>
            <ul className={styles.list}>
              {eligible.map((item, i) => (
                <li key={i} className={styles.listItem}>
                  <Check weight="bold" className={styles.checkIcon} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className={styles.block}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
          >
            <div className={styles.blockHeader}>
              <div className={styles.iconWrapper}>
                <Compass weight="light" />
              </div>
              <h3>{t('internship.expectations.title')}</h3>
            </div>
            <ul className={styles.list}>
              {expectations.map((item, i) => (
                <li key={i} className={styles.listItem}>
                  <Check weight="bold" className={styles.checkIcon} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          className={styles.blockFull}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
        >
          <div className={styles.blockHeaderCentered}>
            <div className={styles.iconWrapper}>
              <Stack weight="light" />
            </div>
            <h3>{t('internship.details.areasTitle')}</h3>
          </div>
          <div className={styles.areas}>
            {areas.map((area, i) => (
              <div key={i} className={styles.areaTag}>
                <span className={styles.areaTagGlow}></span>
                <span style={{ position: 'relative', zIndex: 1 }}>{area}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {Array.isArray(support) && support.length > 0 && (
          <motion.div
            className={styles.support}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
          >
            <div className={styles.blockHeaderCentered}>
              <div className={styles.iconWrapper}>
                <HandHeart weight="light" />
              </div>
              <h3>{t('internship.details.supportTitle')}</h3>
            </div>
            <p className={styles.supportIntro}>{t('internship.details.supportIntro')}</p>
            <div className={styles.supportGrid}>
              {support.map(item => (
                <div key={item.title} className={styles.supportItem}>
                  <Check weight="bold" className={styles.checkIcon} />
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
