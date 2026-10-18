import styles from './ContactFab.module.css'

const WHATSAPP_URL = 'https://wa.me/908506400098'

export default function ContactFab() {
  return (
    <a
      href={WHATSAPP_URL}
      className={styles.fab}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile yazın"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" width="30" height="30">
        <path
          fill="currentColor"
          d="M20.5 3.5A11 11 0 0 0 2.1 16.8L1 23l6.4-1.1A11 11 0 0 0 20.5 3.5zm-8.5 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.8.6.6-3.7-.2-.3A9.1 9.1 0 1 1 12 20.5zm5-6.8c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.2-.3a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1.1 2.7 11.5 11.5 0 0 0 4.4 3.9c1.6.6 2.2.7 3 .6a2.5 2.5 0 0 0 1.7-1.2 2 2 0 0 0 .1-1.2c-.1-.1-.3-.2-.6-.3z"
        />
      </svg>
    </a>
  )
}
