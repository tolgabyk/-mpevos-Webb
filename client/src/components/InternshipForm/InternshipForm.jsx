import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, UploadSimple } from '@phosphor-icons/react'
import { submitInternshipApplication, isInternshipSubmitSuccess } from '../../utils/internshipSubmit'
import styles from './InternshipForm.module.css'

const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  district: '',
  university: '',
  department: '',
  grade: '',
  gpa: '',
  englishLevel: '',
  mandatoryInternship: '',
  internshipDateRange: '',
  internshipWorkDays: '',
  field: '',
  hasPreviousInternship: '',
  previousInternshipInfo: '',
  technologies: '',
  selfIntro: '',
  reason: '',
  projectLink: '',
  github: '',
  linkedin: '',
  portfolio: '',
  remoteWork: '',
  daysPerWeek: '',
  teamMeetings: '',
  howDidYouHear: '',
  additionalNotes: '',
}

const REQUIRED_FIELDS = {
  0: ['fullName', 'email', 'phone', 'city'],
  1: ['university', 'department', 'grade'],
  2: ['mandatoryInternship', 'internshipDateRange', 'internshipWorkDays', 'field', 'hasPreviousInternship'],
  3: ['technologies', 'selfIntro', 'reason'],
  4: [],
  5: ['remoteWork', 'daysPerWeek', 'teamMeetings'],
}

const STEPS = ['personal', 'education', 'internship', 'technical', 'links', 'confirm']

export default function InternshipForm() {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(INITIAL_FORM)
  const [cvFile, setCvFile] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const stepLabels = t('internship.form.steps', { returnObjects: true })
  const mandatoryOptions = t('internship.form.options.mandatory', { returnObjects: true })
  const fieldOptions = t('internship.form.options.field', { returnObjects: true })
  const remoteOptions = t('internship.form.options.remote', { returnObjects: true })
  const meetingOptions = t('internship.form.options.meetings', { returnObjects: true })
  const englishOptions = t('internship.form.options.english', { returnObjects: true })
  const previousInternshipOptions = t('internship.form.options.previousInternship', { returnObjects: true })
  const hearAboutOptions = t('internship.form.options.hearAbout', { returnObjects: true })

  const closeSuccess = () => {
    setStatus('idle')
    setStep(0)
    setForm(INITIAL_FORM)
    setCvFile(null)
    setError('')
    document.body.style.overflow = ''
  }

  useEffect(() => {
    if (status === 'success') {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [status])

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const validateStep = (stepIndex = step) => {
    for (const field of REQUIRED_FIELDS[stepIndex]) {
      if (!form[field]?.trim()) {
        setError(t('internship.form.required'))
        return false
      }
    }

    if (stepIndex === 2 && form.hasPreviousInternship === 'yes' && !form.previousInternshipInfo?.trim()) {
      setError(t('internship.form.required'))
      return false
    }

    if (stepIndex === 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError(t('internship.form.invalidEmail'))
      return false
    }

    if (stepIndex === 4 && !cvFile) {
      setError(t('internship.form.cvRequired'))
      return false
    }

    setError('')
    return true
  }

  const next = () => {
    if (!validateStep()) return
    setStep(s => Math.min(s + 1, STEPS.length - 1))
    window.scrollTo({ top: document.getElementById('internship-apply')?.offsetTop - 80 || 0, behavior: 'smooth' })
  }

  const prev = () => {
    setError('')
    setStep(s => Math.max(s - 1, 0))
  }

  const handleSubmit = async () => {
    if (!validateStep(5) || !cvFile) {
      if (!cvFile) setError(t('internship.form.cvRequired'))
      return
    }

    setStatus('loading')
    setError('')

    try {
      const { res, result } = await submitInternshipApplication(form, cvFile)
      if (isInternshipSubmitSuccess(res, result)) {
        setStatus('success')
      } else {
        setError(result.message || result.error || t('internship.form.error'))
        setStatus('idle')
      }
    } catch {
      setError(t('internship.form.networkError'))
      setStatus('idle')
    }
  }

  const renderField = (name, label, type = 'text', required = false) => (
    <div className={styles.field} key={name}>
      <label htmlFor={name}>{label}{required && ' *'}</label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          value={form[name]}
          onChange={e => update(name, e.target.value)}
          placeholder={label}
          rows={4}
        />
      ) : (
        <input
          id={name}
          type={type}
          value={form[name]}
          onChange={e => update(name, e.target.value)}
          placeholder={label}
        />
      )}
    </div>
  )

  const renderSelect = (name, label, options, required = false) => (
    <div className={styles.field} key={name}>
      <label htmlFor={name}>{label}{required && ' *'}</label>
      <select
        id={name}
        value={form[name]}
        onChange={e => update(name, e.target.value)}
      >
        <option value="">{t('internship.form.select')}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className={styles.fields}>
            {renderField('fullName', t('internship.form.fields.fullName'), 'text', true)}
            <div className={styles.row}>
              {renderField('email', t('internship.form.fields.email'), 'email', true)}
              {renderField('phone', t('internship.form.fields.phone'), 'tel', true)}
            </div>
            <div className={styles.row}>
              {renderField('city', t('internship.form.fields.city'), 'text', true)}
              {renderField('district', t('internship.form.fields.district'))}
            </div>
          </div>
        )
      case 1:
        return (
          <div className={styles.fields}>
            {renderField('university', t('internship.form.fields.university'), 'text', true)}
            <div className={styles.row}>
              {renderField('department', t('internship.form.fields.department'), 'text', true)}
              {renderField('grade', t('internship.form.fields.grade'), 'text', true)}
            </div>
            <div className={styles.row}>
              {renderField('gpa', t('internship.form.fields.gpa'))}
              {renderSelect('englishLevel', t('internship.form.fields.englishLevel'), englishOptions)}
            </div>
          </div>
        )
      case 2:
        return (
          <div className={styles.fields}>
            {renderSelect('mandatoryInternship', t('internship.form.fields.mandatoryInternship'), mandatoryOptions, true)}
            {renderField('internshipDateRange', t('internship.form.fields.internshipDateRange'), 'text', true)}
            {renderField('internshipWorkDays', t('internship.form.fields.internshipWorkDays'), 'text', true)}
            {renderSelect('field', t('internship.form.fields.field'), fieldOptions, true)}
            {renderSelect('hasPreviousInternship', t('internship.form.fields.hasPreviousInternship'), previousInternshipOptions, true)}
            {form.hasPreviousInternship === 'yes' && (
              renderField('previousInternshipInfo', t('internship.form.fields.previousInternshipInfo'), 'textarea', true)
            )}
          </div>
        )
      case 3:
        return (
          <div className={styles.fields}>
            {renderField('technologies', t('internship.form.fields.technologies'), 'text', true)}
            {renderField('selfIntro', t('internship.form.fields.selfIntro'), 'textarea', true)}
            {renderField('reason', t('internship.form.fields.reason'), 'textarea', true)}
          </div>
        )
      case 4:
        return (
          <div className={styles.fields}>
            <p className={styles.hint}>{t('internship.form.linkHint')}</p>
            {renderField('projectLink', t('internship.form.fields.projectLink'))}
            {renderField('github', t('internship.form.fields.github'))}
            {renderField('linkedin', t('internship.form.fields.linkedin'))}
            {renderField('portfolio', t('internship.form.fields.portfolio'))}
            <div className={styles.field}>
              <label>{t('internship.form.fields.cv')} *</label>
              <div className={styles.fileInput}>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={e => setCvFile(e.target.files[0] || null)}
                />
                <div className={styles.fileLabel}>
                  <UploadSimple size={20} />
                  {cvFile ? (
                    <span className={styles.fileName}>{cvFile.name}</span>
                  ) : (
                    <span>{t('internship.form.cvHint')}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      case 5:
        return (
          <div className={styles.fields}>
            {renderSelect('remoteWork', t('internship.form.fields.remoteWork'), remoteOptions, true)}
            {renderField('daysPerWeek', t('internship.form.fields.daysPerWeek'), 'text', true)}
            {renderSelect('teamMeetings', t('internship.form.fields.teamMeetings'), meetingOptions, true)}
            {renderSelect('howDidYouHear', t('internship.form.fields.howDidYouHear'), hearAboutOptions)}
            {renderField('additionalNotes', t('internship.form.fields.additionalNotes'), 'textarea')}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <section id="internship-apply">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="section-label">{t('internship.form.label')}</div>
          <h2 className="section-title">{t('internship.form.title')}</h2>
          <p className="section-subtitle">{t('internship.form.subtitle')}</p>
        </motion.div>

        <div className={styles.wrapper}>
          <div className={styles.steps}>
            {stepLabels.map((label, i) => (
              <div
                key={i}
                className={`${styles.step} ${i === step ? styles.stepActive : ''} ${i < step ? styles.stepDone : ''}`}
              >
                <div className={styles.stepNum}>{i < step ? '✓' : i + 1}</div>
                <span className={styles.stepLabel}>{label}</span>
              </div>
            ))}
          </div>

          <div className={styles.formCard}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className={styles.stepTitle}>{stepLabels[step]}</h3>
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.nav}>
              {step > 0 ? (
                <button type="button" className="btn btn-secondary" onClick={prev}>
                  {t('internship.form.back')}
                </button>
              ) : <div />}

              {step < STEPS.length - 1 ? (
                <button type="button" className="btn btn-primary" onClick={next}>
                  {t('internship.form.next')}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? t('internship.form.sending') : t('internship.form.submit')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            className={styles.successOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.successModal}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className={styles.successIcon}>
                <CheckCircle size={40} weight="duotone" />
              </div>
              <h3>{t('internship.form.successTitle')}</h3>
              <p>{t('internship.form.successDesc')}</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={closeSuccess}
              >
                {t('internship.form.successBtn')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
