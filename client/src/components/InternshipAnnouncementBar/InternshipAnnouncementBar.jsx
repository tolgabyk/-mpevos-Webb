import { useTranslation } from 'react-i18next'
import { Megaphone } from '@phosphor-icons/react'
import styles from './InternshipAnnouncementBar.module.css'

export default function InternshipAnnouncementBar() {
  const { t } = useTranslation()
  const messages = t('internship.announcement.messages', { returnObjects: true })
  const cta = t('internship.announcement.cta')

  if (!Array.isArray(messages)) return null

  const items = [...messages, ...messages]

  return (
    <div className={styles.bar} role="marquee" aria-label={t('internship.announcement.label')}>
      <div className={styles.track}>
        {items.map((msg, i) => (
          <div key={i} className={styles.item}>
            <Megaphone size={14} weight="fill" className={styles.highlight} />
            <span>{msg}</span>
            <span className={styles.dot} />
            <a href="#internship-apply" className={styles.link}>{cta}</a>
          </div>
        ))}
      </div>
    </div>
  )
}
