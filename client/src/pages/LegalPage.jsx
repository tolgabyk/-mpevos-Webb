import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import styles from './LegalPage.module.css'

const TITLES = {
  kvkk: 'KVKK Aydınlatma Metni',
  privacy: 'Gizlilik Politikası',
  cookies: 'Çerez Politikası',
}

export default function LegalPage({ pageKey }) {
  const { t } = useTranslation()
  const blocks = t(`legalPages.${pageKey}.blocks`, { returnObjects: true }) || []
  const title = t(`legalPages.${pageKey}.title`)

  useEffect(() => {
    const previous = document.title
    document.title = `${title} | IMPEVOS`
    return () => {
      document.title = previous
    }
  }, [title])

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className="container">
          <p className={styles.updated}>{t('legalPages.updated')}</p>
          <h1>{title || TITLES[pageKey]}</h1>
          {Array.isArray(blocks) && blocks.map((block) => (
            <section key={block.heading}>
              <h2>{block.heading}</h2>
              <p>{block.text}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
