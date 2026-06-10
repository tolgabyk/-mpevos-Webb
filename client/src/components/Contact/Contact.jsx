import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Phone } from '@phosphor-icons/react'
import styles from './Contact.module.css'

export default function Contact() {
  const { t } = useTranslation()

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.bgLine} aria-hidden="true" />
      <div className="container">
        <motion.div
          className={styles.wrap}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.label}>{t('contact.label')}</span>
          <h2 className={styles.title}>{t('contact.headline')}</h2>
          <p className={styles.subtitle}>{t('contact.subtitle')}</p>

          <div className={styles.actions}>
            <a href="tel:+905344952332" className={styles.phoneBtn}>
              <Phone size={20} weight="duotone" />
              <span>{t('contact.info.help.phone')}</span>
            </a>
            <p className={styles.rep}>{t('contact.rep')}</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
