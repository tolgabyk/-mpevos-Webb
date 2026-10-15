import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styles from './CookieBanner.module.css'

const KEY = 'impevos-consent'

export default function CookieBanner() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(KEY)) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  function choose(value) {
    try {
      window.localStorage.setItem(KEY, value)
    } catch {
      /* storage unavailable */
    }
    document.cookie = `${KEY}=${value}; Max-Age=15552000; Path=/; SameSite=Lax`
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className={styles.banner} role="dialog" aria-label={t('legalPages.cookies.title')}>
      <p>
        {t('cookie.text')}{' '}
        <Link to="/cerez-politikasi">{t('cookie.policy')}</Link>
      </p>
      <div className={styles.actions}>
        <button type="button" className="btn btn-secondary" onClick={() => choose('necessary')}>{t('cookie.reject')}</button>
        <button type="button" className="btn btn-primary" onClick={() => choose('all')}>{t('cookie.accept')}</button>
      </div>
    </div>
  )
}
