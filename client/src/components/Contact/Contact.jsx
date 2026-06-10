import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import styles from './Contact.module.css'

export default function Contact() {
  const { t } = useTranslation()

  return (
    <section id="contact">
      <div className="container">
        <motion.div
          className={styles.simpleWrap}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.headline}>{t('contact.headline')}</h2>
          <p className={styles.headlineAccent}>{t('contact.headlineAccent')}</p>
          <a href="tel:+905344952332" className={styles.phone}>
            {t('contact.info.help.phone')}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
