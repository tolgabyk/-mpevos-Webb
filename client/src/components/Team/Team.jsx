import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  LinkedinLogo,
  TwitterLogo,
  GithubLogo,
  Crown,
  Medal,
  Code,
  Flask,
  Megaphone,
  InstagramLogo,
  GraduationCap,
  Briefcase,
} from '@phosphor-icons/react'
import styles from './Team.module.css'

const DEPARTMENT_ICONS = {
  leadership: Briefcase,
  rd: Flask,
  softwareRd: Code,
  marketing: Megaphone,
  socialMedia: InstagramLogo,
  community: GraduationCap,
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function MemberCard({ member, isLeader, isDeputy, leaderLabel, deputyLabel }) {
  const hasPhoto = Boolean(member.photo)
  const initials = member.initials || getInitials(member.name)

  return (
    <motion.div
      className={`${styles.card} ${isLeader ? styles.cardLeader : ''} ${isDeputy ? styles.cardDeputy : ''}`}
      variants={cardVariants}
    >
      {isLeader && (
        <div className={styles.leaderBadge}>
          <Crown size={11} weight="fill" />
          <span>{leaderLabel}</span>
        </div>
      )}
      {isDeputy && !isLeader && (
        <div className={styles.deputyBadge}>
          <Medal size={11} weight="fill" />
          <span>{deputyLabel}</span>
        </div>
      )}

      <div
        className={`${styles.avatar} ${hasPhoto ? styles.avatarHasPhoto : ''}`}
        style={!hasPhoto && member.gradient ? { background: member.gradient } : undefined}
      >
        {hasPhoto ? (
          <img src={member.photo} alt={member.name} className={styles.avatarImg} />
        ) : (
          <span>{initials}</span>
        )}
        <span className={styles.avatarRing} aria-hidden="true" />
      </div>

      <h3 className={styles.name}>{member.name}</h3>
      <div className={styles.role}>{member.role}</div>

      <div className={styles.socials}>
        <a href={member.linkedin || '#'} aria-label="LinkedIn"><LinkedinLogo weight="fill" /></a>
        <a href={member.secondary || '#'} aria-label={member.secondaryType === 'github' ? 'GitHub' : 'Twitter'}>
          {member.secondaryType === 'github' ? <GithubLogo weight="fill" /> : <TwitterLogo weight="fill" />}
        </a>
      </div>
    </motion.div>
  )
}

export default function Team() {
  const { t } = useTranslation()
  const departments = t('team.departments', { returnObjects: true }) || []
  const leaderLabel = t('team.leaderLabel')
  const deputyLabel = t('team.deputyLabel')
  const totalMembers = departments.reduce((sum, d) => sum + (d.members?.length || 0), 0)

  return (
    <section id="team" className={styles.section}>
      <div className={styles.bgGlow} />
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="section-label">{t('team.label')}</div>
          <h2 className="section-title">
            {t('team.title')} <span className="text-accent">{t('team.titleAccent')}</span> {t('team.titleEnd')}
          </h2>
          <p className="section-subtitle">{t('team.subtitle')}</p>

          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{totalMembers}</span>
              <span className={styles.statLbl}>{t('team.statMembers')}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{departments.length}</span>
              <span className={styles.statLbl}>{t('team.statDepartments')}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>1</span>
              <span className={styles.statLbl}>{t('team.statVision')}</span>
            </div>
          </div>
        </motion.div>

        <div className={styles.departments}>
          {departments.map((dept, idx) => {
            const Icon = DEPARTMENT_ICONS[dept.iconKey] || Briefcase
            const members = dept.members || []
            const leaders = members.filter(m => m.isLeader)
            const others = members.filter(m => !m.isLeader)

            return (
              <motion.div
                key={dept.id || idx}
                className={styles.department}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className={styles.deptHeader}>
                  <div className={styles.deptIcon}>
                    <Icon size={20} weight="duotone" />
                  </div>
                  <div className={styles.deptHeaderText}>
                    <h3 className={styles.deptName}>{dept.name}</h3>
                    <span className={styles.deptCount}>
                      {members.length} {t('team.peopleSuffix')}
                    </span>
                  </div>
                  <div className={styles.deptLine} />
                </div>

                <motion.div
                  className={styles.grid}
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                >
                  {leaders.map((m, i) => (
                    <MemberCard
                      key={`l-${i}`}
                      member={m}
                      isLeader
                      isDeputy={false}
                      leaderLabel={leaderLabel}
                      deputyLabel={deputyLabel}
                    />
                  ))}
                  {others.map((m, i) => (
                    <MemberCard
                      key={`m-${i}`}
                      member={m}
                      isDeputy={Boolean(m.isDeputyLeader)}
                      leaderLabel={leaderLabel}
                      deputyLabel={deputyLabel}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
