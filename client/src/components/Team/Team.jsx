import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { LinkedinLogo, TwitterLogo, GithubLogo } from '@phosphor-icons/react'
import styles from './Team.module.css'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } }
}

export default function Team() {
  const { t } = useTranslation()
  const members = t('team.members', { returnObjects: true }) || []

  return (
    <section id="team">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="section-label">{t('team.label')}</div>
          <h2 className="section-title">
            {t('team.title')} <span className="text-accent">{t('team.titleAccent')}</span> {t('team.titleEnd')}
          </h2>
          <p className="section-subtitle">{t('team.subtitle')}</p>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {members.map((member, i) => (
            <motion.div key={i} className={styles.card} variants={cardVariants}>
              <div
                className={styles.avatar}
                style={{ background: member.gradient }}
              >
                {member.initials}
              </div>
              <h3>{member.name}</h3>
              <div className={styles.role}>{member.role}</div>
              <div className={styles.socials}>
                <a href="#" aria-label="LinkedIn"><LinkedinLogo weight="fill" /></a>
                <a href="#" aria-label={member.initials === 'BG' ? 'GitHub' : 'Twitter'}>
                  {member.initials === 'BG' ? <GithubLogo weight="fill" /> : <TwitterLogo weight="fill" />}
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
