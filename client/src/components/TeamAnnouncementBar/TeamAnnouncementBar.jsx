import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { UsersThree } from '@phosphor-icons/react'
import styles from '../InternshipAnnouncementBar/InternshipAnnouncementBar.module.css'

export default function TeamAnnouncementBar() {
  const { t } = useTranslation()
  const messages = t('joinTeam.announcement.messages', { returnObjects: true })
  const cta = t('joinTeam.announcement.cta')

  if (!Array.isArray(messages)) return null

  const items = [...messages, ...messages]

  return (
    <div className={styles.bar} role="marquee" aria-label={t('joinTeam.announcement.label')}>
      <div className={styles.track}>
        {items.map((msg, i) => (
          <div key={i} className={styles.item}>
            <UsersThree size={14} weight="fill" className={styles.highlight} />
            <span>{msg}</span>
            <span className={styles.dot} />
            <Link to="/ekibe-katil" className={styles.link}>{cta}</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
