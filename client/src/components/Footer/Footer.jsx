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
            <h4>{t('footer.studio', 'Studio')}</h4>
            <ul>
              <li><a href="#projects">{t('nav.projects', 'Products')}</a></li>
              <li><a href="#about">{t('nav.studio', 'Studio Model')}</a></li>
              <li><a href="#process">{t('nav.process', 'How We Work')}</a></li>
              <li><a href="#why">{t('nav.dna', 'Our DNA')}</a></li>
              <li><a href="#team">{t('nav.team', 'Leadership')}</a></li>
              <li><a href="#contact">{t('nav.contact', 'Contact')}</a></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4>{t('footer.products', 'Portfolio')}</h4>
            <ul>
              <li><a href="https://apps.apple.com/tr/app/not-orta%C4%9F%C4%B1m-ai-not-asistan%C4%B1/id6758680814" target="_blank" rel="noopener noreferrer">Not Ortağım (iOS & Android)</a></li>
              <li><a href="https://www.inffyai.com" target="_blank" rel="noopener noreferrer">İnffy Creator OS</a></li>
              <li><a href="https://www.awyronai.com" target="_blank" rel="noopener noreferrer">Awyron AI</a></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4>{t('footer.legal', 'Legal')}</h4>
            <ul>
              <li><Link to="/kvkk">{t('footer.kvkk', 'KVKK Notice')}</Link></li>
              <li><Link to="/gizlilik">{t('footer.privacy', 'Privacy Policy')}</Link></li>
              <li><Link to="/cerez-politikasi">{t('footer.cookies', 'Cookie Policy')}</Link></li>
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
