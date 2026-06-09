import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, UploadSimple } from '@phosphor-icons/react'
import { submitJoinTeamApplication } from '../../utils/joinTeamSubmit'
import {
  INITIAL_FORM,
  STEPS,
  APPLICATION_TYPES,
  SOFTWARE_ROLES,
  YES_NO_OPTIONS,
  OTHER_DEPARTMENTS,
  getQuestionSet,
  getRequiredFields,
} from './constants'
import styles from './JoinTeamForm.module.css'

const STEP_LABELS = ['Kişisel Bilgiler', 'Başvuru Türü', 'Alan Soruları', 'Genel Değerlendirme']

const PHONE_REGEX = /^(\+90|0)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$|^\+?[0-9]{10,15}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function JoinTeamForm() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(INITIAL_FORM)
  const [cvFile, setCvFile] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

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

  const validateStep = (stepIndex = step) => {
    if (form.website) {
      setError('Başvuru gönderilemedi.')
      return false
    }

    const required = getRequiredFields(stepIndex, form)

    for (const field of required) {
      if (!String(form[field] ?? '').trim()) {
        setError('Lütfen tüm zorunlu alanları doldurun.')
        return false
      }
    }

    if (stepIndex === 0) {
      if (!EMAIL_REGEX.test(form.email)) {
        setError('Geçerli bir e-posta adresi giriniz.')
        return false
      }
      if (!PHONE_REGEX.test(form.phone.replace(/[\s\-().]/g, '')) && !/^\+?[0-9]{10,15}$/.test(form.phone.replace(/[\s\-().]/g, ''))) {
        setError('Geçerli bir telefon numarası giriniz.')
        return false
      }
      const age = Number(form.age)
      if (Number.isNaN(age) || age < 16 || age > 80) {
        setError('Geçerli bir yaş giriniz (16-80).')
        return false
      }
      if (!cvFile) {
        setError('CV yüklemeniz gerekmektedir.')
        return false
      }
      const allowed = ['.pdf', '.doc', '.docx']
      const ext = cvFile.name.toLowerCase().slice(cvFile.name.lastIndexOf('.'))
      if (!allowed.includes(ext)) {
        setError('CV dosyası PDF, DOC veya DOCX formatında olmalıdır.')
        return false
      }
      if (cvFile.size > 5 * 1024 * 1024) {
        setError('CV dosyası en fazla 5 MB olabilir.')
        return false
      }
    }

    if (stepIndex === 1 && !form.voluntaryConsent) {
      setError('Gönüllü çalışma modelini onaylamadan başvuru gönderemezsiniz.')
      return false
    }

    setError('')
    return true
  }

  const next = () => {
    if (!validateStep()) return
    setStep(s => Math.min(s + 1, STEPS.length - 1))
    document.getElementById('join-team-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const prev = () => {
    setError('')
    setStep(s => Math.max(s - 1, 0))
  }

  const handleSubmit = async () => {
    if (!validateStep(3) || !validateStep(2) || !validateStep(1) || !validateStep(0)) return

    setStatus('loading')
    setError('')

    try {
      const { res, result } = await submitJoinTeamApplication(form, cvFile)
      const success = res.ok && (result.ok === true || (result.ok !== false && !result.error))
      if (success) {
        setStatus('success')
      } else {
        setError(result.message || result.error || 'Başvuru gönderilemedi. Lütfen tekrar deneyin.')
        setStatus('idle')
      }
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
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
      <select id={name} value={form[name]} onChange={e => update(name, e.target.value)}>
        <option value="">Seçiniz</option>
        {options.map(opt => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
    </div>
  )

  const renderSoftwareQuestions = () => (
    <div className={styles.fields}>
      {renderSelect('softwareRole', 'Hangi alanda çalışmak istiyorsun?', SOFTWARE_ROLES, true)}
      {renderField('technologies', 'Bildiğin teknolojiler nelerdir?', 'textarea', true)}
      {renderSelect('cursorUsed', 'Cursor kullandın mı?', YES_NO_OPTIONS, true)}
      {renderSelect('claudeUsed', 'Claude kullandın mı?', YES_NO_OPTIONS, true)}
      {renderSelect('antigravityUsed', 'Antigravity kullandın mı?', YES_NO_OPTIONS, true)}
      {renderField('aiToolsUsage', 'ChatGPT veya yapay zeka destekli geliştirme araçlarını nasıl kullanıyorsun?', 'textarea', true)}
      {renderField('aiCodingExperience', 'AI araçlarıyla kod yazma, hata çözme veya proje geliştirme deneyimin var mı?', 'textarea')}
      {renderSelect('realProjectExperience', 'Daha önce gerçek bir projede görev aldın mı?', YES_NO_OPTIONS)}
      {renderSelect('githubUsed', 'GitHub kullanıyor musun?', YES_NO_OPTIONS)}
      {renderSelect('gitBranchKnowledge', 'Git ve branch mantığını biliyor musun?', YES_NO_OPTIONS)}
      {renderSelect('teamWork', 'Takım çalışmasına uygun musun?', YES_NO_OPTIONS)}
      {renderField('hoursPerWeek', 'Haftada kaç saat ayırabilirsin?', 'text', true)}
      {renderSelect('dailyReport', 'Günlük rapor verebilir misin?', YES_NO_OPTIONS)}
      {renderSelect('crmTracking', 'CRM panel üzerinden görev takibi yapabilir misin?', YES_NO_OPTIONS)}
      {renderField('technicalScore', 'Kendini 1-10 arasında teknik olarak kaç puan verirsin?', 'number')}
      {renderField('projectExample', 'Kısa bir örnek proje veya yaptığın işi anlat', 'textarea', true)}
      {renderField('portfolioLinks', 'Portfolyo, GitHub veya canlı proje linkin varsa paylaş', 'textarea')}
    </div>
  )

  const renderMarketingQuestions = () => (
    <div className={styles.fields}>
      {renderField('marketingExperience', 'Daha önce satış, pazarlama veya sosyal medya işi yaptın mı?', 'textarea', true)}
      {renderSelect('businessMeetings', 'İşletmelerle görüşme yapabilir misin?', YES_NO_OPTIONS)}
      {renderSelect('phoneFaceToFace', 'Telefonda veya yüz yüze müşteriyle konuşabilir misin?', YES_NO_OPTIONS)}
      {renderSelect('socialMediaContent', 'Sosyal medya içerik üretimi yapabilir misin?', YES_NO_OPTIONS)}
      {renderField('campaignExperience', 'Reklam, kampanya veya marka yönetimi deneyimin var mı?', 'textarea')}
      {renderField('designTools', 'Canva, CapCut, Meta Business Suite veya benzeri araçlar kullandın mı?', 'textarea')}
      {renderField('hoursPerWeekMarketing', 'Haftada kaç saat ayırabilirsin?', 'text', true)}
      {renderField('communicationScore', 'Kendini iletişim konusunda 1-10 arası kaç puan verirsin?', 'number', true)}
      {renderField('howToMarketImpevos', 'İmpevos\'un yazılım ürünlerini işletmelere nasıl pazarlarsın?', 'textarea', true)}
      {renderSelect('salesTargets', 'Satış hedefleriyle çalışabilir misin?', YES_NO_OPTIONS)}
      {renderSelect('customerTracking', 'Müşteri takibi ve raporlama yapabilir misin?', YES_NO_OPTIONS)}
    </div>
  )

  const renderActiveProjectQuestions = () => (
    <div className={styles.fields}>
      {renderField('interestedProjects', 'Hangi projelerde görev almak istersin?', 'textarea', true)}
      {renderField('bestPosition', 'Hangi pozisyonda daha iyisin?', 'text', true)}
      {renderSelect('deliveryProcessSeen', 'Daha önce proje teslim süreci gördün mü?', YES_NO_OPTIONS)}
      {renderSelect('deadlineWork', 'Proje teslim tarihleriyle çalışabilir misin?', YES_NO_OPTIONS)}
      {renderSelect('dailyReportAP', 'Günlük rapor verebilir misin?', YES_NO_OPTIONS)}
      {renderSelect('crmTrackingAP', 'CRM panel üzerinden görev takibi yapabilir misin?', YES_NO_OPTIONS)}
      {renderSelect('regularMeetings', 'Ekip toplantılarına düzenli katılabilir misin?', YES_NO_OPTIONS)}
      {renderSelect('onTimeDelivery', 'Sana verilen görevi zamanında teslim edebilir misin?', YES_NO_OPTIONS, true)}
      {renderField('toolsUsedAP', 'Hangi araçları kullanabiliyorsun?', 'textarea')}
      {renderField('weeklyHoursAP', 'Haftalık aktif çalışma süren nedir?', 'text', true)}
    </div>
  )

  const renderOtherQuestions = () => (
    <div className={styles.fields}>
      {renderSelect('departmentInterest', 'Hangi departmanda görev almak istiyorsun?', OTHER_DEPARTMENTS.map(d => ({ value: d, label: d })), true)}
      {renderField('departmentExperience', 'Daha önce bu alanda deneyimin var mı?', 'textarea')}
      {renderField('organizationSkills', 'Organizasyon ve takip becerin nasıl?', 'textarea')}
      {renderSelect('regularReporting', 'Düzenli rapor verebilir misin?', YES_NO_OPTIONS)}
      {renderSelect('teamCommunication', 'Ekip içi iletişimde aktif olabilir misin?', YES_NO_OPTIONS)}
      {renderField('toolsUsedOther', 'Hangi araçları kullanabiliyorsun?', 'textarea')}
      {renderField('hoursPerWeekOther', 'Haftada kaç saat ayırabilirsin?', 'text', true)}
      {renderField('contributionIdea', 'Bu departmanda İmpevos\'a nasıl katkı sağlayabileceğini düşünüyorsun?', 'textarea', true)}
    </div>
  )

  const renderSpecificQuestions = () => {
    const set = getQuestionSet(form.applicationType)
    if (set === 'software') return renderSoftwareQuestions()
    if (set === 'marketing') return renderMarketingQuestions()
    if (set === 'active-project') return renderActiveProjectQuestions()
    return renderOtherQuestions()
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className={styles.fields}>
            {renderField('fullName', 'Ad Soyad', 'text', true)}
            <div className={styles.row}>
              {renderField('email', 'E-posta', 'email', true)}
              {renderField('phone', 'Telefon', 'tel', true)}
            </div>
            <div className={styles.row}>
              {renderField('city', 'Şehir', 'text', true)}
              {renderField('age', 'Yaş', 'number', true)}
            </div>
            {renderField('universityInfo', 'Üniversite / bölüm / mezuniyet durumu', 'text', true)}
            {renderField('linkedin', 'LinkedIn profili', 'url')}
            {renderField('githubPortfolio', 'GitHub / portfolyo linki', 'url')}
            <div className={styles.field}>
              <label>CV Yükleme *</label>
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
                    <span>PDF, DOC veya DOCX — maks. 5 MB</span>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.honeypot} aria-hidden="true">
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={e => update('website', e.target.value)}
              />
            </div>
          </div>
        )
      case 1:
        return (
          <div className={styles.fields}>
            {renderSelect('applicationType', 'Başvuru Türü', APPLICATION_TYPES, true)}
            <div className={styles.consentBox}>
              <p className={styles.consentInfo}>
                İmpevos&apos;ta şu an birçok ekip ve proje gönüllü çalışma modeliyle ilerlemektedir.
                Bu süreçte amaç; gerçek projelerde deneyim kazanmak, ekip çalışmasını öğrenmek,
                portfolyo geliştirmek ve uzun vadede İmpevos&apos;un aktif ekip yapısına dahil
                olabilecek kişileri belirlemektir.
              </p>
              <label className={styles.consentLabel}>
                <input
                  type="checkbox"
                  checked={form.voluntaryConsent}
                  onChange={e => update('voluntaryConsent', e.target.checked)}
                />
                <span>
                  İmpevos&apos;ta mevcut başvuru sürecinin gönüllü çalışma ve deneyim kazanma
                  odaklı olduğunu okudum, anladım ve kabul ediyorum. *
                </span>
              </label>
            </div>
          </div>
        )
      case 2:
        return form.applicationType ? renderSpecificQuestions() : (
          <p className={styles.consentInfo}>Lütfen önce başvuru türünü seçin.</p>
        )
      case 3:
        return (
          <div className={styles.fields}>
            {renderField('whyImpevos', 'Neden İmpevos ekibine katılmak istiyorsun?', 'textarea', true)}
            {renderField('differentiator', 'Seni diğer adaylardan ayıran şey nedir?', 'textarea', true)}
            {renderField('disciplineMeaning', 'Disiplinli çalışmak senin için ne ifade ediyor?', 'textarea', true)}
            {renderSelect('remoteWork', 'Uzaktan çalışma düzenine uygun musun?', YES_NO_OPTIONS, true)}
            {renderSelect('longTermTeam', 'Uzun vadeli ekip içinde yer almak ister misin?', YES_NO_OPTIONS, true)}
            {renderField('developmentAreas', 'Kendini geliştirmek istediğin 3 alan nedir?', 'textarea', true)}
            {renderField('responsibilityMeaning', 'Gerçek projelerde sorumluluk almak senin için ne ifade ediyor?', 'textarea', true)}
            {renderSelect('activeCommunication', 'Ekip içinde aktif iletişim kurabilir misin?', YES_NO_OPTIONS, true)}
            {renderSelect('feedbackOpen', 'Geri bildirim almaya ve kendini geliştirmeye açık mısın?', YES_NO_OPTIONS, true)}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <section id="join-team-form" className={styles.section}>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.steps}>
            {STEP_LABELS.map((label, i) => (
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
                <h3 className={styles.stepTitle}>{STEP_LABELS[step]}</h3>
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.nav}>
              {step > 0 ? (
                <button type="button" className="btn btn-secondary" onClick={prev}>
                  Geri
                </button>
              ) : <div />}

              {step < STEPS.length - 1 ? (
                <button type="button" className="btn btn-primary" onClick={next}>
                  İleri
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}
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
            >
              <div className={styles.successIcon}>
                <CheckCircle size={40} weight="duotone" />
              </div>
              <h3>Başvurun Alındı!</h3>
              <p>
                Başvurun başarıyla alındı. İmpevos ekibine katılmak istediğin için teşekkür ederiz.
                Başvurun incelendikten sonra uygun görülmesi halinde seninle iletişime geçeceğiz.
              </p>
              <button type="button" className="btn btn-primary" onClick={closeSuccess}>
                Tamam
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
