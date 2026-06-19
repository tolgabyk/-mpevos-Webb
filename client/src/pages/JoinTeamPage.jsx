import { motion } from 'framer-motion'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import JoinTeamForm from '../components/JoinTeamForm/JoinTeamForm'
import { DEPARTMENTS, DEPARTMENT_GROUPS, getDepartmentsByGroup } from '../components/JoinTeamForm/constants'
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
                Yazılım, satış, pazarlama, tasarım, operasyon ve daha birçok departmanda
                gerçek projelerde deneyim kazanmak isteyen ekip arkadaşları arıyoruz.
              </p>
            </motion.div>
          </div>
        </section>

        <section className={styles.infoBanner}>
          <div className="container">
            <div className={styles.infoCard}>
              <p>
                İmpevos olarak gönüllü çalışma modeliyle gerçek yazılım ve teknoloji
                projeleri geliştiriyoruz. Aşağıdaki {DEPARTMENTS.length} departmandan birini seçerek
                başvurunu tamamlayabilirsin.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.categories} id="departments">
          <div className="container">
            <div className="section-header">
              <div className="section-label">Departmanlar</div>
              <h2 className="section-title">Hangi Departmanda Yer Almak İstiyorsun?</h2>
              <p className="section-subtitle">
                4 ana grupta toplam {DEPARTMENTS.length} departmana başvurabilirsin.
                <span className={styles.deployTag}>Güncel sürüm: v2026.06</span>
              </p>
            </div>

            {DEPARTMENT_GROUPS.map(group => {
              const items = getDepartmentsByGroup(group.id)
              return (
                <div key={group.id} className={styles.deptGroup}>
                  <div className={styles.deptGroupHeader}>
                    <h3>{group.title} ({items.length})</h3>
                    <p>{group.subtitle}</p>
                  </div>
                  <div className={styles.categoryGrid}>
                    {items.map(dept => (
                      <div key={dept.value} className={styles.categoryCard}>
                        <h4>{dept.label}</h4>
                        {dept.leader && <p className={styles.leader}>{dept.leader}</p>}
                        <p>{dept.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className={styles.formSection} id="join-team-form">
          <div className="container">
            <div className={styles.formSectionHeader}>
              <div className="section-label">Başvuru Formu</div>
              <h2 className="section-title">Başvurunu Tamamla</h2>
              <p className="section-subtitle">
                Departmanını seç, alan sorularını doldur ve başvurunu gönder.
              </p>
            </div>
          </div>
          <JoinTeamForm />
        </section>

        <section className={styles.motivation}>
          <div className="container">
            <div className={styles.motivationCard}>
              <p>
                İmpevos&apos;ta sadece izleyen değil, üreten bir ekibin parçası olursun.
                Gerçek projelerde görev alır, modern araçlarla çalışır ve kendini profesyonel dünyaya hazırlarsın.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
