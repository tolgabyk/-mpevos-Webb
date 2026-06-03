import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiUrl, parseJsonResponse } from '../../utils/api'
import styles from './AdminDashboard.module.css'

const STATUS_LABELS = {
  new: 'Yeni Başvuru',
  reviewing: 'İnceleniyor',
  invited: 'Görüşmeye Çağrıldı',
  accepted: 'Kabul Edildi',
  rejected: 'Reddedildi',
}

const STATUS_BADGE = {
  new: styles.badgeNew,
  reviewing: styles.badgeReviewing,
  invited: styles.badgeInvited,
  accepted: styles.badgeAccepted,
  rejected: styles.badgeRejected,
}

const FIELD_OPTIONS = [
  { value: '', label: 'Tümü' },
  { value: 'web-frontend', label: 'Web Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'mobile-ios', label: 'Mobil iOS' },
  { value: 'mobile-android', label: 'Mobil Android' },
  { value: 'ui-ux', label: 'UI/UX Tasarım' },
  { value: 'ai', label: 'Yapay Zeka' },
  { value: 'digital-marketing', label: 'Dijital Pazarlama' },
  { value: 'social-media', label: 'Sosyal Medya' },
  { value: 'project-management', label: 'Proje Yönetimi' },
  { value: 'undecided', label: 'Henüz karar vermedim' },
]

const MANDATORY_OPTIONS = [
  { value: '', label: 'Tümü' },
  { value: 'yes', label: 'Evet' },
  { value: 'no', label: 'Hayır' },
  { value: 'unsure', label: 'Emin değilim' },
]

const DETAIL_FIELDS = [
  { key: 'fullName', label: 'Ad Soyad' },
  { key: 'email', label: 'E-posta' },
  { key: 'phone', label: 'Telefon' },
  { key: 'city', label: 'Şehir' },
  { key: 'district', label: 'İlçe' },
  { key: 'university', label: 'Üniversite' },
  { key: 'department', label: 'Bölüm' },
  { key: 'grade', label: 'Sınıf' },
  { key: 'gpa', label: 'Not Ortalaması' },
  { key: 'englishLevel', label: 'İngilizce Seviyesi' },
  { key: 'mandatoryInternship', label: 'Zorunlu Yaz Stajı' },
  { key: 'internshipDateRange', label: 'Staj Tarih Aralığı' },
  { key: 'internshipWorkDays', label: 'Staj Süresi (İş Günü)' },
  { key: 'field', label: 'Staj Alanı' },
  { key: 'hasPreviousInternship', label: 'Önceki Staj Deneyimi' },
  { key: 'previousInternshipInfo', label: 'Staj Deneyimi Detayı', full: true },
  { key: 'technologies', label: 'Teknolojiler', full: true },
  { key: 'selfIntro', label: 'Kendini Tanıtma', full: true },
  { key: 'reason', label: 'Staj Sebebi', full: true },
  { key: 'projectLink', label: 'Proje Linki' },
  { key: 'github', label: 'GitHub' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'portfolio', label: 'Portfolyo' },
  { key: 'remoteWork', label: 'Uzaktan Çalışma' },
  { key: 'daysPerWeek', label: 'Haftalık Aktif Gün' },
  { key: 'teamMeetings', label: 'Ekip Toplantıları' },
  { key: 'howDidYouHear', label: 'İmpevos\'u Nereden Duydun' },
  { key: 'additionalNotes', label: 'Ek Notlar', full: true },
]

function formatValue(key, value) {
  if (!value) return '—'
  const maps = {
    mandatoryInternship: { yes: 'Evet', no: 'Hayır', unsure: 'Emin değilim' },
    hasPreviousInternship: { yes: 'Evet', no: 'Hayır' },
    remoteWork: { yes: 'Evet', no: 'Hayır', partial: 'Kısmen' },
    teamMeetings: { yes: 'Evet', no: 'Hayır', depends: 'Duruma göre' },
    englishLevel: { beginner: 'Başlangıç', intermediate: 'Orta', good: 'İyi', advanced: 'İleri' },
    howDidYouHear: {
      instagram: 'Instagram', linkedin: 'LinkedIn', friend: 'Arkadaş / Tanıdık',
      university: 'Üniversite', google: 'Google / Arama', other: 'Diğer',
    },
    field: Object.fromEntries(FIELD_OPTIONS.filter(o => o.value).map(o => [o.value, o.label])),
  }
  return maps[key]?.[value] || value
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [selected, setSelected] = useState(null)
  const [editStatus, setEditStatus] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [filters, setFilters] = useState({
    status: '', field: '', university: '', mandatoryInternship: '',
  })

  const token = localStorage.getItem('impevos-admin-token')

  const authFetch = useCallback(async (url, options = {}) => {
    const res = await fetch(apiUrl(url), {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    })
    if (res.status === 401) {
      localStorage.removeItem('impevos-admin-token')
      navigate('/admin/login')
      return null
    }
    return res
  }, [token, navigate])

  const loadApplications = useCallback(async () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })

    const res = await authFetch(`/api/admin/applications?${params}`)
    if (res?.ok) setApplications(await res.json())
  }, [authFetch, filters])

  useEffect(() => {
    if (!token) {
      navigate('/admin/login')
      return
    }
    loadApplications()
  }, [token, navigate, loadApplications])

  const openDetail = async (id) => {
    const res = await authFetch(`/api/admin/applications/${id}`)
    if (res?.ok) {
      const app = await res.json()
      setSelected(app)
      setEditStatus(app.status)
      setEditNotes(app.adminNotes || '')
    }
  }

  const saveChanges = async () => {
    if (!selected) return
    setSaving(true)
    const res = await authFetch(`/api/admin/applications/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: editStatus, adminNotes: editNotes }),
    })
    if (res?.ok) {
      const updated = await res.json()
      setSelected(updated)
      loadApplications()
    }
    setSaving(false)
  }

  const downloadCv = async () => {
    if (!selected) return
    const res = await authFetch(`/api/admin/applications/${selected.id}/cv`)
    if (res?.ok) {
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = selected.cvOriginalName || 'cv.pdf'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const logout = () => {
    localStorage.removeItem('impevos-admin-token')
    navigate('/admin/login')
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>IMPE<span>VOS</span> Admin</h1>
        <div className={styles.headerActions}>
          <span className={styles.count}>{applications.length} başvuru</span>
          <button className="btn btn-secondary" onClick={logout}>Çıkış</button>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Durum</label>
          <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
            <option value="">Tümü</option>
            {Object.entries(STATUS_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Alan</label>
          <select value={filters.field} onChange={e => setFilters(f => ({ ...f, field: e.target.value }))}>
            {FIELD_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Üniversite</label>
          <input
            type="text"
            placeholder="Üniversite ara..."
            value={filters.university}
            onChange={e => setFilters(f => ({ ...f, university: e.target.value }))}
          />
        </div>
        <div className={styles.filterGroup}>
          <label>Zorunlu Staj</label>
          <select value={filters.mandatoryInternship} onChange={e => setFilters(f => ({ ...f, mandatoryInternship: e.target.value }))}>
            {MANDATORY_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.tableWrap}>
        {applications.length === 0 ? (
          <div className={styles.empty}>Henüz başvuru bulunmuyor.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>Üniversite</th>
                <th>Alan</th>
                <th>Durum</th>
                <th>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id} onClick={() => openDetail(app.id)}>
                  <td className={styles.name}>{app.fullName}</td>
                  <td>{app.university}</td>
                  <td>{formatValue('field', app.field)}</td>
                  <td>
                    <span className={`${styles.badge} ${STATUS_BADGE[app.status]}`}>
                      {STATUS_LABELS[app.status]}
                    </span>
                  </td>
                  <td>{formatDate(app.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className={styles.detail} onClick={() => setSelected(null)}>
          <div className={styles.detailCard} onClick={e => e.stopPropagation()}>
            <div className={styles.detailHeader}>
              <div>
                <h2>{selected.fullName}</h2>
                <p style={{ color: 'var(--color-secondary-muted)', fontSize: '0.875rem', marginTop: 4 }}>
                  {formatDate(selected.createdAt)}
                </p>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelected(null)}>×</button>
            </div>

            <div className={styles.detailGrid}>
              {DETAIL_FIELDS.map(({ key, label, full }) => (
                <div key={key} className={`${styles.detailField} ${full ? styles.full : ''}`}>
                  <label>{label}</label>
                  <p>{formatValue(key, selected[key])}</p>
                </div>
              ))}
              {selected.cvFilename && (
                <div className={styles.detailField}>
                  <label>CV</label>
                  <button className={styles.cvLink} onClick={downloadCv}>
                    {selected.cvOriginalName || 'CV İndir'}
                  </button>
                </div>
              )}
            </div>

            <div className={styles.statusSection}>
              <div>
                <label>Başvuru Durumu</label>
                <select value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                  {Object.entries(STATUS_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Admin Notu</label>
                <textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder="Başvuru hakkında not ekleyin..."
                />
              </div>
              <div className={styles.statusActions}>
                <button className="btn btn-primary" onClick={saveChanges} disabled={saving}>
                  {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
