import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Check } from '@phosphor-icons/react'
import styles from './InternshipExpectations.module.css'

export default function InternshipExpectations() {
  const { t } = useTranslation()
  const items = t('internship.expectations.items', { returnObjects: true })

  return (
    <section id="internship-expectations" className={styles.section}>
      <div className="container">
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <h3 className={styles.title}>{t('internship.expectations.title')}</h3>
          <ul className={styles.list}>
            {items.map((item, i) => (
              <motion.li
                key={i}
                className={styles.item}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <span className={styles.check}>
                  <Check size={12} weight="bold" />
                </span>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
