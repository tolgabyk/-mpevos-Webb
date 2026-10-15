import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './Career.module.css'

export default function Career() {
  const { t } = useTranslation()
  const [status, setStatus] = useState('idle')

  async function onSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setStatus('sending')
    try {
      const response = await fetch('/api/career/apply', { method: 'POST', body: data })
      if (!response.ok) throw new Error('failed')
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="career" className={styles.section} aria-labelledby="career-title">
      <div className="container">
        <div className={styles.grid}>
          <div>
            <div className="section-label">{t('careerSection.label')}</div>
            <h2 id="career-title" className="section-title">{t('careerSection.title')}</h2>
            <p>{t('careerSection.subtitle')}</p>
          </div>
          <form className={styles.form} onSubmit={onSubmit}>
            {status === 'success' ? (
              <p className={styles.success} role="status">{t('careerSection.success')}</p>
            ) : (
              <>
                <label>
                  {t('careerSection.name')}
                  <input name="name" required autoComplete="name" />
                </label>
                <label>
                  {t('careerSection.university')}
                  <input name="university" required />
                </label>
                <label>
                  {t('careerSection.department')}
                  <input name="department" required />
                </label>
                <label>
                  {t('careerSection.cv')}
                  <input name="cv" type="file" required accept=".pdf,.doc,.docx,application/pdf" />
                  <span className={styles.hint}>{t('careerSection.cvHint')}</span>
                </label>
                {status === 'error' ? <p className={styles.error} role="alert">{t('careerSection.error')}</p> : null}
                <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? t('careerSection.sending') : t('careerSection.submit')}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
