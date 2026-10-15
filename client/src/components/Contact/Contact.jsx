import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Phone, LinkedinLogo, InstagramLogo, EnvelopeSimple } from '@phosphor-icons/react'
import styles from './Contact.module.css'

export default function Contact() {
  const { t } = useTranslation()
  const [status, setStatus] = useState('idle')

  async function onSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const payload = Object.fromEntries(new FormData(form).entries())
    setStatus('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error('failed')
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.bgLine} aria-hidden="true" />
      <div className="container">
        <motion.div
          className={styles.layout}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.wrap}>
            <span className={styles.label}>{t('contact.label')}</span>
            <h2 className={styles.title}>{t('contact.headline')}</h2>
            <p className={styles.subtitle}>{t('contact.subtitle')}</p>
            <div className={styles.actions}>
              <a href="mailto:info@impevos.com.tr" className={styles.phoneBtn}>
                <EnvelopeSimple size={20} weight="duotone" />
                <span>info@impevos.com.tr</span>
              </a>
              <a href="tel:+908506400098" className={styles.phoneBtn}>
                <Phone size={20} weight="duotone" />
                <span>{t('contact.info.help.phone')}</span>
              </a>
              <a href="https://www.linkedin.com/company/112823150" className={styles.phoneBtn} target="_blank" rel="noopener noreferrer">
                <LinkedinLogo size={20} weight="fill" />
                <span>LinkedIn</span>
              </a>
              <a href="https://www.instagram.com/impevos" className={styles.phoneBtn} target="_blank" rel="noopener noreferrer">
                <InstagramLogo size={20} weight="fill" />
                <span>@impevos</span>
              </a>
            </div>
          </div>

          <form className={styles.form} onSubmit={onSubmit}>
            {status === 'success' ? (
              <p role="status">{t('contact.success')}</p>
            ) : (
              <>
                <label>
                  {t('contact.name')}
                  <input name="name" required autoComplete="name" />
                </label>
                <label>
                  {t('contact.email')}
                  <input name="email" type="email" required autoComplete="email" />
                </label>
                <label>
                  {t('contact.company')}
                  <input name="company" required autoComplete="organization" />
                </label>
                <label>
                  {t('contact.message')}
                  <textarea name="message" required rows={5} />
                </label>
                {status === 'error' ? <p className={styles.error} role="alert">{t('contact.error')}</p> : null}
                <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? t('contact.sending') : t('contact.submit')}
                </button>
              </>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  )
}
