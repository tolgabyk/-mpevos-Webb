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
            <span className={styles.label}>{t('contact.label', 'Get In Touch')}</span>
            <h2 className={styles.title}>{t('contact.headline', 'Partner with the studio.')}</h2>
            <p className={styles.subtitle}>{t('contact.subtitle', 'Have a partnership proposal, investment inquiry, or want to connect with our leadership team? Send us a message below.')}</p>
            <div className={styles.actions}>
              <a href="mailto:info@impevos.com.tr" className={styles.phoneBtn}>
                <EnvelopeSimple size={20} weight="duotone" />
                <span>info@impevos.com.tr</span>
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
              <p role="status">{t('contact.success', 'Your message has been received. Our team will get back to you shortly.')}</p>
            ) : (
              <>
                <label>
                  {t('contact.name', 'Full Name')}
                  <input name="name" required autoComplete="name" placeholder="John Doe" />
                </label>
                <label>
                  {t('contact.email', 'Email Address')}
                  <input name="email" type="email" required autoComplete="email" placeholder="john@example.com" />
                </label>
                <label>
                  {t('contact.topic', 'Inquiry Topic')}
                  <select name="topic" defaultValue="partnership" className={styles.select}>
                    <option value="partnership">Studio Partnership & Co-Building</option>
                    <option value="investment">Investment & Ecosystem</option>
                    <option value="publishing">App Publishing & Scaling</option>
                    <option value="press">Press & Media</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </label>
                <label>
                  {t('contact.company', 'Organization / Venture (Optional)')}
                  <input name="company" autoComplete="organization" placeholder="Venture or Company name" />
                </label>
                <label>
                  {t('contact.message', 'Message')}
                  <textarea name="message" required rows={4} placeholder="Tell us about your proposal or inquiry..." />
                </label>
                {status === 'error' ? <p className={styles.error} role="alert">{t('contact.error', 'Message could not be sent. Please write directly to info@impevos.com.tr')}</p> : null}
                <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? t('contact.sending', 'Sending...') : t('contact.submit', 'Send Message')}
                </button>
              </>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  )
}
