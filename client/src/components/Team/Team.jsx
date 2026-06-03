import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  LinkedinLogo,
  TwitterLogo,
  GithubLogo,
  Code,
  Flask,
  Megaphone,
  InstagramLogo,
  GraduationCap,
  Briefcase,
  Handshake,
} from '@phosphor-icons/react'
import styles from './Team.module.css'

const DEPARTMENT_ICONS = {
  leadership: Briefcase,
  rd: Flask,
  softwareRd: Code,
  marketing: Megaphone,
  socialMedia: InstagramLogo,
  community: GraduationCap,
  business: Handshake,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.15 } 
  },
}

const nodeVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 30 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  },
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function MemberNode({ member, isLeader }) {
  const hasPhoto = Boolean(member.photo)
  const initials = member.initials || getInitials(member.name)

  return (
    <motion.div
      className={`${styles.node} ${isLeader ? styles.nodeLeader : ''}`}
      variants={nodeVariants}
    >
      <div className={styles.nodeCard}>
        <div className={`${styles.avatar} ${hasPhoto ? styles.avatarHasPhoto : ''}`}>
          {hasPhoto ? (
            <img 
              src={member.photo} 
              alt={member.name} 
              className={styles.avatarImg} 
              style={member.objectPosition ? { objectPosition: member.objectPosition } : {}}
            />
          ) : (
            <span>{initials}</span>
          )}
          <span className={styles.avatarRing} />
        </div>

        <div className={styles.nodeInfo}>
          <h3 className={styles.name}>{member.name}</h3>
          <div className={styles.role}>{member.role}</div>
          
          <div className={styles.socials}>
            {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer"><LinkedinLogo weight="fill" /></a>}
            {member.instagram && <a href={member.instagram} target="_blank" rel="noopener noreferrer"><InstagramLogo weight="fill" /></a>}
            {member.secondary && (
              <a href={member.secondary} target="_blank" rel="noopener noreferrer">
                {member.secondaryType === 'github' ? <GithubLogo weight="fill" /> : <TwitterLogo weight="fill" />}
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Team() {
  const { t } = useTranslation()
  const departments = t('team.departments', { returnObjects: true }) || []
  const totalMembers = departments.reduce((sum, d) => sum + (d.members?.length || 0), 0)

  // Separate Leadership from other departments
  const leadershipDept = departments.find(d => d.iconKey === 'leadership')
  const otherDepts = departments.filter(d => d.iconKey !== 'leadership')

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

        <div className={styles.treeContainer}>
          {/* Peak: Leadership */}
          {leadershipDept && (
            <div className={styles.peak}>
              <motion.div 
                className={styles.deptLabel}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <Briefcase size={20} weight="duotone" />
                <span>{leadershipDept.name}</span>
              </motion.div>
              
              <div className={styles.leadershipWrapper}>
                <div className={styles.leadershipLine} />
                <motion.div 
                  className={styles.leadershipNodes}
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {leadershipDept.members?.map((m, i) => (
                    <div key={`lead-wrap-${i}`} className={styles.nodeWrapper}>
                      <div className={styles.connectorLine} />
                      <MemberNode
                        member={m}
                        isLeader={false}
                      />
                    </div>
                  ))}
                </motion.div>
              </div>
              <div className={styles.mainStem} />
            </div>
          )}

          {/* Branches: Other Departments */}
          <div className={styles.branches}>
            {otherDepts.map((dept, idx) => {
              const Icon = DEPARTMENT_ICONS[dept.iconKey] || Briefcase
              return (
                <div key={dept.id || idx} className={styles.branch}>
                  <div className={styles.branchLine} />
                  <div className={styles.branchContent}>
                    <motion.div 
                      className={styles.deptLabel}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                    >
                      <Icon size={18} weight="duotone" />
                      <span>{dept.name}</span>
                    </motion.div>
                    
                    <div className={styles.gridWrapper}>
                      <div className={styles.horizontalConnector} />
                      <motion.div 
                        className={styles.memberGrid}
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                      >
                        {dept.members?.map((m, i) => (
                          <div key={`mem-wrap-${idx}-${i}`} className={styles.nodeWrapper}>
                            <div className={styles.connectorLine} />
                            <MemberNode
                              member={m}
                              isLeader={false}
                            />
                          </div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                  <div className={styles.branchLineBottom} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}



