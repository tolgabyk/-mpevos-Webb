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
              <li><a href="#team">{t('nav.team')}</a></li>
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
              <li><a href="#">{t('footer.privacy')}</a></li>
              <li><a href="#">{t('footer.terms')}</a></li>
              <li><a href="#">{t('footer.cookies')}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <p>{t('footer.copyright')}</p>
          <div className={styles.socials}>
            <a href="https://www.linkedin.com/company/impevos/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedinLogo weight="fill" /></a>
            <a href="https://www.instagram.com/impevos?igsh=eHFsa2sxbDBxYXRk" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramLogo weight="fill" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
