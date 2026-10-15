import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LinkedinLogo, InstagramLogo } from '@phosphor-icons/react'
import styles from './Footer.module.css'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer id="footer" className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <a href="#hero" className={styles.logo}>
              <img src="/logo.png" alt="IMPEVOS Logo" />
            </a>
            <p>{t('footer.desc')}</p>
          </div>

          {/* Links */}
          <div className={styles.column}>
            <h4>{t('footer.links')}</h4>
            <ul>
              <li><a href="#about">{t('nav.about')}</a></li>
              <li><a href="#services">{t('nav.services')}</a></li>
              <li><a href="#projects">{t('nav.projects')}</a></li>
              <li><Link to="/ekibe-katil">{t('nav.joinTeam')}</Link></li>
              <li><a href="#contact">{t('nav.contact')}</a></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4>{t('footer.services')}</h4>
            <ul>
              <li><a href="#services">{t('services.items.0.title')}</a></li>
              <li><a href="#services">{t('services.items.1.title')}</a></li>
              <li><a href="#services">{t('services.items.2.title')}</a></li>
              <li><a href="#services">{t('services.items.3.title')}</a></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4>{t('footer.legal')}</h4>
            <ul>
              <li><Link to="/kvkk">{t('footer.kvkk')}</Link></li>
              <li><Link to="/gizlilik">{t('footer.privacy')}</Link></li>
              <li><Link to="/cerez-politikasi">{t('footer.cookies')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <div>
            <p>IMPEVOS A.Ş.</p>
            <p>{t('footer.address')}</p>
            <p>{t('footer.mersis')} · {t('footer.tax')}</p>
            <p>© {new Date().getFullYear()} IMPEVOS A.Ş. {t('footer.rights')}</p>
          </div>
          <div className={styles.socials}>
            <a href="https://www.linkedin.com/company/112823150" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedinLogo weight="fill" /></a>
            <a href="https://www.instagram.com/impevos" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramLogo weight="fill" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
