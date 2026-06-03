import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, X } from '@phosphor-icons/react'
import styles from './InternshipWelcomePopup.module.css'

const STORAGE_KEY = 'impevos-internship-popup-seen'

export default function InternshipWelcomePopup() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return
    const timer = setTimeout(() => setOpen(true), 600)
    return () => clearTimeout(timer)
  }, [])

  const close = () => {
    sessionStorage.setItem(STORAGE_KEY, '1')
    setOpen(false)
    document.body.style.overflow = ''
  }

  const goApply = () => {
    close()
    document.getElementById('internship-apply')?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="internship-popup-title"
          >
            <button type="button" className={styles.close} onClick={close} aria-label={t('internship.popup.close')}>
              <X size={20} weight="bold" />
            </button>

            <div className={styles.iconWrap}>
              <GraduationCap size={36} weight="fill" />
            </div>

            <span className={styles.badge}>{t('internship.popup.badge')}</span>
            <h2 id="internship-popup-title" className={styles.title}>{t('internship.popup.title')}</h2>
            <p className={styles.desc}>{t('internship.popup.desc')}</p>

            <div className={styles.actions}>
              <button type="button" className="btn btn-primary" onClick={goApply}>
                {t('internship.popup.cta')}
              </button>
              <button type="button" className={styles.later} onClick={close}>
                {t('internship.popup.later')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
