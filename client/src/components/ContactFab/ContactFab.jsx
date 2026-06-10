import { EnvelopeSimple } from '@phosphor-icons/react'
import styles from './ContactFab.module.css'

export default function ContactFab() {
  return (
    <a href="#contact" className={styles.fab} aria-label="İletişime geç">
      <EnvelopeSimple size={22} weight="fill" />
    </a>
  )
}
