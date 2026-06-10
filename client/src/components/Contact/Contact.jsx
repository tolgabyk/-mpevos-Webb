import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Envelope, Phone, MapPin } from '@phosphor-icons/react'
import styles from './Contact.module.css'

export default function Contact() {
  const { t } = useTranslation()
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        setStatus('success')
        e.target.reset()
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }

    setTimeout(() => {
      if (status !== 'idle') setStatus('idle')
    }, 5000)
  }

  const infoBoxes = [
    { icon: Envelope, label: t('contact.info.email.label'), value: t('contact.info.email.value') },
    { icon: Phone, label: t('contact.info.phone.label'), value: t('contact.info.phone.value') },
    { icon: MapPin, label: t('contact.info.address.label'), value: t('contact.info.address.value') },
  ]

  return (
    <section id="contact">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="section-label">{t('contact.label')}</div>
          <h2 className="section-title">
            {t('contact.title')} <span className="text-accent">{t('contact.titleAccent')}</span> {t('contact.titleEnd')}
          </h2>
          <p className="section-subtitle">{t('contact.subtitle')}</p>
        </motion.div>

        <div className={styles.grid}>
          {/* Info Side */}
          <motion.div
            className={styles.info}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <h3>{t('contact.info.title')}</h3>
            <p>{t('contact.info.desc')}</p>
            
            <div className={styles.details}>
              {infoBoxes.map((box, i) => (
                <div key={i} className={styles.item}>
                  <div className={styles.iconWrap}>
                    <box.icon size={24} weight="duotone" />
                  </div>
                  <div>
                    <span className={styles.label}>{box.label}</span>
                    <span className={styles.value}>{box.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.helpBox}>
              <p className={styles.helpText}>{t('contact.info.help.text')}</p>
              <p className={styles.helpContact}>
                {t('contact.info.help.cta')}{' '}
                <a href="tel:+905344952332" className={styles.helpPhone}>
                  {t('contact.info.help.phone')}
                </a>
              </p>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.form
            className={styles.form}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <input type="text" name="name" placeholder={t('contact.form.name')} required />
              </div>
              <div className={styles.formGroup}>
                <input type="email" name="email" placeholder={t('contact.form.email')} required />
              </div>
            </div>
            <div className={styles.formGroup}>
              <input type="text" name="subject" placeholder={t('contact.form.subject')} />
            </div>
            <div className={styles.formGroup}>
              <textarea name="message" placeholder={t('contact.form.message')} rows="5" required />
            </div>
            
            <div className={styles.submitWrap}>
              <button 
                type="submit" 
                className={`btn btn-primary ${styles.submitBtn}`}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? t('contact.form.sending') : t('contact.form.submit')}
              </button>
              
              {status === 'success' && <p className={styles.successMsg}>{t('contact.form.success')}</p>}
              {status === 'error' && <p className={styles.errorMsg}>{t('contact.form.error')}</p>}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
