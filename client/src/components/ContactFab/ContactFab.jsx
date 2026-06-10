import { useTranslation } from 'react-i18next'
import { ArrowUpRight } from '@phosphor-icons/react'
import styles from './ContactFab.module.css'

export default function ContactFab() {
  const { t } = useTranslation()

  return (
    <a href="#contact" className={styles.fab} aria-label={t('contact.fab')}>
      <span className={styles.label}>{t('contact.fab')}</span>
      <ArrowUpRight size={18} weight="bold" />
    </a>
  )
}
