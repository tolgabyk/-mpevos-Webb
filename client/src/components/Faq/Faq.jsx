import { useTranslation } from 'react-i18next'
import { Plus } from '@phosphor-icons/react'
import styles from './Faq.module.css'

export default function Faq() {
  const { t } = useTranslation()
  const items = t('faq.items', { returnObjects: true }) || []

  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.intro}>
          <div className="section-label">{t('faq.label')}</div>
          <h2 id="faq-title" className={styles.title}>{t('faq.title')}</h2>
          <p className={styles.lead}>{t('faq.subtitle')}</p>
        </div>
        <div className={styles.list}>
          {Array.isArray(items) && items.map((item, i) => (
            <details key={item.q} className={styles.item} open={i === 0}>
              <summary>
                <span>{item.q}</span>
                <Plus size={18} weight="bold" className={styles.toggle} aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
