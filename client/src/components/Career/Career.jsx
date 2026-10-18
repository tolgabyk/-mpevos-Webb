import { useTranslation } from 'react-i18next'
import { INTERNSHIP_APPLICATIONS_OPEN } from '../../data/config'
import styles from './Career.module.css'

export default function Career() {
  const { t } = useTranslation()

  return (
    <section id="career" className={styles.section} aria-labelledby="career-title">
      <div className="container">
        <div className={styles.grid}>
          <div>
            <div className="section-label">{t('careerSection.label')}</div>
            <h2 id="career-title" className="section-title">{t('careerSection.title')}</h2>
            <p>{t('careerSection.subtitle')}</p>
          </div>
          {!INTERNSHIP_APPLICATIONS_OPEN ? (
            <div className={styles.form} role="status">
              <h3 className={styles.closedTitle}>{t('careerSection.closedTitle')}</h3>
              <p className={styles.hint}>{t('careerSection.closedText')}</p>
            </div>
          ) : (
            <div className={styles.form}>
              <h3 className={styles.closedTitle}>{t('careerSection.openTitle')}</h3>
              <p className={styles.hint}>{t('careerSection.openText')}</p>
              <a href="#internship-apply" className="btn btn-primary">{t('careerSection.openCta')}</a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
