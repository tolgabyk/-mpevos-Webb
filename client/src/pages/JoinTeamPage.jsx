import { motion } from 'framer-motion'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import JoinTeamForm from '../components/JoinTeamForm/JoinTeamForm'
import { CATEGORIES } from '../components/JoinTeamForm/constants'
import styles from './JoinTeamPage.module.css'

export default function JoinTeamPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main>
        <section className={styles.hero}>
          <div className="container">
            <motion.div
              className={styles.heroContent}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className={styles.badge}>Ekibe Katıl</span>
              <h1 className={styles.title}>İmpevos Ekibine Katıl</h1>
              <p className={styles.subtitle}>
                Yazılım, yapay zeka, mobil uygulama, web geliştirme, pazarlama ve operasyon
                alanlarında bizimle birlikte gerçek projelerde deneyim kazanmak ve aktif
                ekiplerde yer almak isteyen ekip arkadaşları arıyoruz.
              </p>
            </motion.div>
          </div>
        </section>

        <section className={styles.infoBanner}>
          <div className="container">
            <motion.div
              className={styles.infoCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p>
                İmpevos olarak şu an gönüllü çalışma modeliyle gerçek yazılım ve teknoloji
                projeleri geliştiriyoruz. Ekibimize katılan kişiler aktif projelerde görev alarak
                deneyim kazanır, ekip çalışmasını öğrenir ve modern yazılım süreçlerine dahil olur.
                Özellikle Claude, Cursor, Antigravity, ChatGPT, GitHub ve yapay zeka destekli
                geliştirme araçlarını kullanabilen veya öğrenmeye açık adaylar öncelikli olarak
                değerlendirilecektir.
              </p>
            </motion.div>
          </div>
        </section>

        <section className={styles.categories}>
          <div className="container">
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="section-label">Başvuru Kategorileri</div>
              <h2 className="section-title">Hangi Alanda Katılmak İstiyorsun?</h2>
              <p className="section-subtitle">
                Aşağıdaki kategorilerden birini seçerek başvuru formunu doldurabilirsin.
              </p>
            </motion.div>

            <div className={styles.categoryGrid}>
              {CATEGORIES.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  className={styles.categoryCard}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <h3>{cat.title}</h3>
                  {cat.leader && <p className={styles.leader}>{cat.leader}</p>}
                  <p>{cat.description}</p>
                  <div className={styles.roleTags}>
                    {cat.roles.map(role => (
                      <span key={role} className={styles.roleTag}>{role}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.formSection}>
          <div className="container">
            <motion.div
              className={styles.formSectionHeader}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="section-label">Başvuru Formu</div>
              <h2 className="section-title">Başvurunu Tamamla</h2>
              <p className="section-subtitle">
                Tüm alanları eksiksiz doldur. Başvurun ekibimiz tarafından incelenecektir.
              </p>
            </motion.div>
          </div>
          <JoinTeamForm />
        </section>

        <section className={styles.motivation}>
          <div className="container">
            <motion.div
              className={styles.motivationCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p>
                İmpevos&apos;ta sadece izleyen değil, üreten bir ekibin parçası olursun.
                Gerçek projelerde görev alır, modern araçlarla çalışır, ekip deneyimi kazanır
                ve kendini profesyonel dünyaya hazırlarsın.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
